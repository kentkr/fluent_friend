import { useState } from "react"
import { TextField } from "@mui/material"
import './Input.css'
import { inputSx } from "./sx"

function Input({ onSendMessage }: { onSendMessage: CallableFunction }) {
  const [message, setMessage] = useState<string>('')

  function handleSend() {
    onSendMessage(message)
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
      //<input id='input' className='input' contentEditable placeholder='Type your message here' />
  return <>
    <div className='input-container'>
      <TextField
        sx={inputSx}
        value={message}
        multiline
        maxRows={4}
        variant="outlined"
        placeholder="Write in any language..."
        fullWidth
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    <button className="send-button">send</button>
    </div>
  </>
}

export default Input
