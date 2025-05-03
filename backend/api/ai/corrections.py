from typing import List, Optional, Tuple
import difflib
import textwrap
import re
import json
from .types import Decoration, DecSpec, DecAttrs
from .clients import client, MODEL
from .tools import tools

TOKENIZE_RE = re.compile(r'\s?\w+(?:-\w+)*|\s?[^\w\s]')

def get_decorations(original_message: str, corrected_message: str, offset: int) -> List[Decoration]:
    # split text - retain spaces, ignore '-'
    split_orig = TOKENIZE_RE.findall(original_message)
    split_corrected = TOKENIZE_RE.findall(corrected_message)

    # get seq of separated words
    seq = difflib.SequenceMatcher(None, split_orig, split_corrected)
    decorations = []
    # offset starts at 1 for editor start token
    for ops in seq.get_opcodes():
        if ops[0] == 'replace':
            # otherwise append each word to corrections
            deletion = ''.join(split_orig[ops[1]:ops[2]])
            insertion = ''.join(split_corrected[ops[3]:ops[4]])
            corr = ExplainCorrection(original_message, corrected_message, deletion, insertion).replace()
            d = Decoration(from_ = offset, to = offset+len(insertion), spec = DecSpec(correction = corr, attrs = DecAttrs('correction-dec')))
            decorations.append(d)
        elif ops[0] == 'insert':
            deletion = ''
            insertion = ''.join(split_corrected[ops[3]:ops[4]])
            corr = ExplainCorrection(original_message, corrected_message, deletion, insertion).replace()
            d = Decoration(from_ = offset, to = offset+len(insertion), spec = DecSpec(correction = corr, attrs = DecAttrs('correction-dec')))
            decorations.append(d)
        elif ops[0] == 'delete':
            deletion = ''.join(split_orig[ops[1]:ops[2]])
            insertion = ''
            corr = ExplainCorrection(original_message, corrected_message, deletion, insertion).replace()
            d = Decoration(from_ = offset, to = offset+len(insertion), spec = DecSpec(correction = corr, attrs = DecAttrs('correction-dec')))
            decorations.append(d)
        offset += len(''.join(split_orig[ops[1]:ops[2]]))
    return decorations

def get_correction(message: str) -> str:
    system_prompt = """
        In the language that the phrase is written, replace it for spelling and grammar. 
        Be sure to add or replace accent marks if necessary. If the use of a word is 
        incorrect replace it. Do not respond to questions.
    """

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        tools=tools,
        stream=False,
        n = 1,
        max_tokens = 100,
        temperature = .1,
    )
    
    if response.choices[0].message.content is None:
        raise Exception(f'Api call returned no content: {response}')
    # TODO not the way to do this lol
    j = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
    return j['corrected_message']

class ExplainCorrection:
    def __init__(
        self, 
        old_str: str, 
        new_str: str, 
        deletion: Optional[str],
        insertion: Optional[str],
    ) -> None:
        self.old_str = old_str
        self.new_str = new_str
        self.deletion = deletion
        self.insertion = insertion
        self.sys_prompt = textwrap.dedent(
            f"""
                Be a language teacher and describe why text was corrected. Only respond in less than a sentence-no extra words.
                Example responses: "Needs capitalization at the start of a sentence.", "Incorrect spelling", 
                "This word is a better replacement for the context."
            """.strip()
        )
 

    def replace(self) -> str | None:
        user_message = textwrap.dedent(
            f"""
                original message: '{self.old_str}'
                new message: '{self.new_str}'
                replaced string: '{self.deletion}'
                replacement string: '{self.insertion}'
            """.strip()
        )
        return self.ask_ai(system_prompt = self.sys_prompt, user_message = user_message)


    def insert(self) -> str | None:
        user_message = textwrap.dedent(
            f"""
                original message: '{self.old_str}'
                new message: '{self.new_str}'
                inserted string: '{self.insertion}'
            """.strip()
        )
        return self.ask_ai(system_prompt = self.sys_prompt, user_message = user_message)

    def delete(self) -> str | None:
        user_message = textwrap.dedent(
            f"""
                original message: '{self.old_str}'
                new message: '{self.new_str}'
                deleted string: '{self.deletion}'
            """.strip()
        )
        return self.ask_ai(system_prompt = self.sys_prompt, user_message = user_message)

    def ask_ai(self, system_prompt: str, user_message: str) -> str | None:
        res = client.chat.completions.create(
            model=MODEL,
            messages=[
                {'role': 'system', 'content': system_prompt}, # type: ignore
                {'role': 'user', 'content': user_message},
            ],
            tools=tools,
            stream=False,
            n=1,
            max_tokens=1000,
            temperature=.1
        )
        return res.choices[0].message.content
