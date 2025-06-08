import { MutableRefObject, useRef } from "react"

function Input({ onSendMessage }: { onSendMessage: CallableFunction }) {
  const inputRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const handleSend = () => {
    if (!inputRef.current) {
      return
    }

    const content = inputRef.current.innerHTML
    if (content) {
      onSendMessage(content)
      inputRef.current.innerText = ''
    }
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
      <div 
        ref={inputRef}
        className="input"
        contentEditable
        onKeyDown={handleKeyPress}
        data-placeholder="Type a message..."
        />
      <button className='send-button'>
        send
      </button>
    </div>
  </>
}

export default Input
