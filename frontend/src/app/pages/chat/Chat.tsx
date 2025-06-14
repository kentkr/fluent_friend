import { useState, useRef, useEffect } from 'react'
import Input from '../../../features/chat/components/input/Input'
import './Chat.css'
import { MessageObj } from '../../../features/chat/types'
import UserMessage from '../../../features/chat/components/usermessage/UserMessage'
import AiMessage from '../../../features/chat/components/aimessage/AiMessage'
import { LEN_MESSAGE_HISTORY } from '../../../features/chat/constants'

const firstMessage = `
Hey there! I'm an AI chat bot that will help you practice any language.
Send me a message in that language to get started.
`

function Chat() {
  const [messages, setMessages] = useState<MessageObj[]>([
    {id: 0, message: firstMessage, sender: 'ai'}
  ])
  const ws = useRef(null as unknown as WebSocket)
  const messagesEndRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

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
    const fromMessageHistory = Math.max(1, messages.length-LEN_MESSAGE_HISTORY)
    const wsMessage = {
      aiMessageId: aiMessage.id,
      userMessageId: userMessage.id,
      message: userMessage.message, 
      messageHistory: messages.slice(fromMessageHistory)
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
          <li ref={messagesEndRef}/>
        </ol>
      </div>
      <Input onSendMessage={handleSendMessages}/>
    </div>
  )
}

export default Chat
