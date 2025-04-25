from openai.types.chat import ChatCompletionToolParam

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
