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

function createWsMessage(): JSON {

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
      id: messages.length+1,
      message: content,
      sender: 'user'
    }
    // create future ai message
    const aiMessage = {
      id: messages.length+2,
      sender: 'ai'
    }
    const startOfMessageHistory = Math.min(1, messages.length-LEN_MESSAGE_HISTORY)
    const x = {
      aiMessageId: aiMessage.id,
      userMessageId: userMessage.id,
      messageHistory: messages.slice(startOfMessageHistory)
    }
    ws.current.send(JSON.stringify(x))
    setMessages(prev => {
      return [...prev, userMessage, aiMessage]
    })
  }
  window.messages = messages

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
