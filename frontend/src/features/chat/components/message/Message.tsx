import './Message.css'

function Message({ message, sender }: { message: string, sender: string }) {
  let className: string
  if (sender === 'ai') {
    className = 'ai-message'
  } else {
    className = 'user-message'
  }
  
  return <>
    <li 
      className={className}
      // TODO: sanatize to keep formatting
      dangerouslySetInnerHTML={{__html: message}}
    >
    </li>   
  </>
}

export default Message
