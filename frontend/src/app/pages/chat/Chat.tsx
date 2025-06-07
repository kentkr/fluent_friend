import { useState, useReducer, useRef, useEffect } from 'react'
import Input from '../../../features/chat/components/input/Input'
import Message from '../../../features/chat/components/message/Message'
import './Chat.css'
import '/Users/kylekent/Desktop/fluent_friend/frontend/src/features/chat/components/message/Message.css'
import DotLoader from '../../../components/dotloader/DotLoader'

interface MessageObj {
  id: number;
  message: string;
  sender: string;
  correction?: string;
}

function AiMessage({ message }: { message: MessageObj }) {
  return (
    <div className='ai-message'>
      {
        message.message === undefined ?
          <DotLoader color='var(--color-foreground)' /> :
          <p>{message.message}</p> 
      }
    </div>
  )
}

function UserMessage({ message }: { message: MessageObj }) {
  return (
    <div className='user-message'>
      <p>{message.message}</p>
      <hr></hr>
      {
        message.correction === undefined ? 
          <DotLoader color='var(--color-background)' /> :
          <p>message.correction</p>
      }
    </div>
  )
}

function Chat() {
  const [messages, setMessages] = useState<MessageObj[]>([
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

  window.messages = messages
  return <>
    <div className='chat-page'>
      <div className='message-container'>
        <ol id='message-list'>
          {messages.map(msg => (
            <li key={msg.id}>
              {msg.sender === 'ai' && <AiMessage message={msg} />}
              {msg.sender === 'user' && <UserMessage message={msg} />}
            </li>
          ))}
        </ol>
      </div>
      <Input onSendMessage={handleSendMessages}/>
    </div>
  </>
}

export default Chat
