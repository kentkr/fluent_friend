import './UserMessage.css'
import { MessageObj } from '../../types'
import DotLoader from '../../../../components/dotloader/DotLoader'
import nl2br from 'nl2br';
import DOMPurify from 'dompurify';

export default function UserMessage({ message }: { message: MessageObj }) {
  let sanitizedMessage = undefined
  if (message.message) {
    sanitizedMessage = DOMPurify.sanitize(nl2br(message.message))   
  }

  let sanitizedCorrection = undefined
  if (message.correction) {
    sanitizedCorrection = DOMPurify.sanitize(message.correction)
  }

  if (sanitizedMessage === undefined) {
    alert('Internal error: user message not found')
  }

  return (
    <div className='user-message'>
      <p dangerouslySetInnerHTML={{ __html: sanitizedMessage !== undefined ? sanitizedMessage : 'Error >:(' }}></p>
      <hr className='m-1'></hr>
      {
        sanitizedCorrection === undefined ? 
          <DotLoader color='var(--color-background)' /> :
          <p dangerouslySetInnerHTML={{ __html: sanitizedCorrection }}></p>
      }
    </div>
  )
}
