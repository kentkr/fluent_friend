import {useState} from 'react'
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
    {id: 0, message: 'first', sender: 'ai'}
  ])

  const handleSendMessages = (content: string) => {
    const userMessage = {
      id: messages.length + 1,
      message: content,
      sender: 'user'
    };
    setMessages([...messages, userMessage])
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        message: `I received your message: "${content}"`,
        sender: 'ai'
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 1000);
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
