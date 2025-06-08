import { useState, useReducer, useRef, useEffect } from 'react'
import Input from '../../../features/chat/components/input/Input'
import Message from '../../../features/chat/components/message/Message'
import './Chat.css'
import '/Users/kylekent/Desktop/fluent_friend/frontend/src/features/chat/components/message/Message.css'
import DotLoader from '../../../components/dotloader/DotLoader'

const LEN_MESSAGE_HISTORY = 5

interface MessageObj {
  id: number;
  sender: string;
  message?: string;
  correction?: string;
}

interface GptInputMessages {
  role: string,
  content: string
}

interface WsSend {
  aiMessageId: number;
  userMessageId: number;
  messageHistory: GptInputMessages[]
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
          <p dangerouslySetInnerHTML={{ __html: message.correction }}></p>
      }
    </div>
  )
}

function Chat() {
  const [messages, setMessages] = useState<MessageObj[]>([
    {id: 0, message: 'first', sender: 'ai'}
  ])
  const ws = useRef(null as unknown as WebSocket)

  // mount ws on first render, set how ws handles messages
  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_WS_URL)
    ws.current.onmessage = (event) => {
      const eventData = JSON.parse(event.data)
      setMessages(prev => {
        const nextMessages = prev.map((message) => {
          if (message.id === eventData.id) {
            if (eventData.action === 'userCorrection') {
              message.correction = eventData.correction
              return message } 
            if (eventData.action === 'aiMessage') {
              message.message = eventData.message
              return message 
            }
          }
          return message
        })
        return nextMessages
      })
    }

    if (ws.current.readyState === ws.current.OPEN) {
      return () => ws.current.close();
    }
  },
  []
  )

  const handleSendMessages = (content: string) => {
    const userMessage = {
      id: messages.length,
      message: content,
      sender: 'user'
    }
    // create future ai message
    const aiMessage = {
      id: messages.length+1,
      sender: 'ai'
    }
    const startOfMessageHistory = Math.max(1, messages.length-LEN_MESSAGE_HISTORY)
    console.log('start message hi', startOfMessageHistory)
    const wsMessage = {
      aiMessageId: aiMessage.id,
      userMessageId: userMessage.id,
      message: userMessage.message, 
      messageHistory: messages.slice(startOfMessageHistory)
    }
    ws.current.send(JSON.stringify(wsMessage))
    setMessages(prev => {
      return [...prev, userMessage, aiMessage]
    })
  }

 return (
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
  )
}

export default Chat
