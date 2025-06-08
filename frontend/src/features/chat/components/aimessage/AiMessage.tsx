import './AiMessage.css'
import { MessageObj } from '../../types'
import DotLoader from '../../../../components/dotloader/DotLoader'

export default function AiMessage({ message }: { message: MessageObj }) {
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
