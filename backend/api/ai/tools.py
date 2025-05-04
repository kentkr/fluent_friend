from openai.types.chat import ChatCompletionToolParam

from api.ai.types import DecAttrs, DecSpec, Decoration

tools: list[ChatCompletionToolParam] = [{
    "type": "function",
    "function": {
        "name": "get_corrections",
        "description": "Get corrections for a message.",
        "parameters": {
            "type": "object",
            "properties": {
                "original_message": {
                    "type": "string",
                    "description": "The original message to be corrected"
                },
                "corrected_message": {
                    "type": "string",
                    "description": "The corrected message from the ai"
                },
            },
            "required": [
                "original_message",
                'corrected_message'
            ],
            "additionalProperties": False
        },
        "strict": True
    }
}]

create_decs_tool: ChatCompletionToolParam =  {
    'type': 'function',
    'function': {
        'name': 'create_decs',
        'description': 'Create corrections for each error a string. It should be called once per error.',
        'parameters': {
            'type': 'object',
            'properties': {
                'index': {
                    'type': 'integer',
                    'description': 'list index of correction'
                },
                # Should this be not required?
                'correction_type': {
                    'type': 'string',
                    'enum': [
                        'grammatical',
                        'typo',
                        'semantic',
                        'fluency',
                    ],
                    'description': 'an enum of correction types'
                },
                'correction_explanation': {
                    'type': 'string',
                    'description': 'description of what is wrong. Be as concise as possible like "Incorrect spelling" or "Typo", "Missing punctuation"'
                },
            },
            'required': [
                'index',
                'correction_str',
                'correction_type',
                'correction_explanation'
            ],
            "additionalProperties": False
        },
        'strict': True
    }
}

def create_decs(index: int, corrected_str: str, correction_type: str, correction_explanation: str) -> Decoration:
    print(index)
    print(corrected_str)
    print(correction_type)
    print(correction_explanation)
    return Decoration(index, index+len(corrected_str), DecSpec(correction_type, DecAttrs('correction-dec')))
