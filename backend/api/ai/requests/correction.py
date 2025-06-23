
import re
import difflib
from openai import AsyncOpenAI

def _corr_to_html(og_msg: str, corr_msg: str) -> str:
    """ 
    Do a diff algo on the two input strings. Insert html spans
    into the string
    """
    # quick fix to handle line breaks
    og_msg = og_msg.replace('\n', '<br/>')
    corr_msg = corr_msg.replace('\n', '<br/>')
    # split text - retain spaces, ignore '-'
    split_orig = re.findall(r'\s?\w+(?:-\w+)*|\s?[^\w\s]', og_msg)
    split_corrected = re.findall(r'\s?\w+(?:-\w+)*|\s?[^\w\s]', corr_msg)

    replace_delete_span = '<span class="correction-delete">'
    insert_span = '<span class="correction-insert">'

    # get seq of separated words
    seq = difflib.SequenceMatcher(None, split_orig, split_corrected)
    corrections = ''
    for ops in seq.get_opcodes():
        if ops[0] == 'equal':
            corrections += ''.join(split_corrected[ops[3]:ops[4]])
        if ops[0] == 'replace':
            # otherwise append each word to corrections
            corrections += replace_delete_span + ''.join(split_orig[ops[1]:ops[2]]) + '</span>' + ' ' # space to improve readbility
            corrections += insert_span + ''.join(split_corrected[ops[3]:ops[4]]) + '</span>'
        if ops[0] == 'insert':
            corrections += insert_span + ''.join(split_corrected[ops[3]:ops[4]]) + '</span>'
        if ops[0] == 'delete':
            corrections += replace_delete_span + ''.join(split_orig[ops[1]:ops[2]]) + '</span>'

    return corrections

async def corrections(client: AsyncOpenAI, prompt: str, message: str) -> str:
    """
    Given a string, return a corrected version. For now 
    the correction returns as a html string

    TODO: Return a json
    """
    sys_msg = {
        'role': 'developer',
        'content': prompt
    }
    message_history = [sys_msg]

    user_msg = {
        'role': 'user',
        'content': message
    }
    message_history.append(user_msg)

    res = await client.chat.completions.create(
        model = 'gpt-3.5-turbo',
        messages = message_history, # type: ignore 
        n = 1,
        max_tokens = 200,
        temperature = 0.1,
    ) 

    corr = res.choices[0].message.content
    if not corr:
        raise Exception('Correction response is null')
    corr_as_html = _corr_to_html(message, corr)

    return corr_as_html
