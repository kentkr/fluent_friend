import './UserMessage.css'
import { MessageObj } from '../../types'
import DotLoader from '../../../../components/dotloader/DotLoader'

export default function UserMessage({ message }: { message: MessageObj }) {
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
