import './AiMessage.css'
import { MessageObj } from '../../types'
import DotLoader from '../../../../components/dotloader/DotLoader'
import DOMPurify from 'dompurify';

export default function AiMessage({ message }: { message: MessageObj }) {
  let sanitizedMessage = undefined
  if (message.message) {
    sanitizedMessage = DOMPurify.sanitize(message.message)
  }
  return (
    <div className='ai-message'>
      {
        sanitizedMessage === undefined ?
          <DotLoader color='var(--color-foreground)' /> :
          <p>{message.message}</p> 
      }
    </div>
  )
}
