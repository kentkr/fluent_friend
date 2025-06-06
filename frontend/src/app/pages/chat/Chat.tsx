import { useState, useReducer, useRef, useEffect } from 'react'
import Input from '../../../features/chat/components/input/Input'
import Message from '../../../features/chat/components/message/Message'
import './Chat.css'

interface MessageProps {
  id: number;
  message: string;
  sender: string;
}

function Chat() {
  const [messages, setMessages] = useState<MessageProps[]>([
    {id: Date.now(), message: 'first', sender: 'ai'}
  ])
  const ws = useRef(null as unknown as WebSocket)

  // mount ws on first render
  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_WS_URL)
    ws.current.onmessage = (event) => {
      const aiMessage = {
        id: Date.now(),
        message: event.data,
        sender: 'ai'
      }
      setMessages(prev => [...prev, aiMessage])
    }
    if (ws.current.readyState === ws.current.OPEN) {
      return () => ws.current.close();
    }
  },
  []
  )

  const handleSendMessages = (content: string) => {
    const userMessage = {
      id: Date.now(),
      message: content,
      sender: 'user'
    }
    ws.current.send(content)
    setMessages(prev => {
      return [...prev, userMessage]
    })
  }

  return <>
    <div className='chat-page'>
      <div className='message-container'>
        <ol id='message-list'>
          {messages.map(msg => (
            <Message 
              key={msg.id} 
              message={msg.message} 
              sender={msg.sender} 
            />
          ))}
        </ol>
      </div>
      <Input onSendMessage={handleSendMessages}/>
    </div>
  </>
}

export default Chat
