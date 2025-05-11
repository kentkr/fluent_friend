import { Replacement } from "../../api/lt.d"
import { ToolTipInfo } from "../../pm/suggestion.d"
import BubbleMenu from "../bubblemenu/BubbleMenu"
import { Editor  } from '@tiptap/react'

function Message({ text, className }: { text: string, className: string }) {
  if (!text) return
  return (
    <p className={className} >{text}</p>
  )
}

function Replacements({ list }: { list: any[] }) {
  if (!list || list.length === 0) return
  return (
    <ol className='flex'>
      {list.map((replacement: Replacement) => 
        <li className='p-1' key={replacement.value}>
          <button className='bg-green'>
            {replacement.value.replace(/^ | $|^$/g, '·')} 
          </button>
        </li>
      )}
    </ol>
  )
}

function Tooltip ({ editor, tti }: { editor: Editor, tti: ToolTipInfo | undefined }) {
  if (!editor || !tti) return

  const shortMessage = tti.suggSpec.ltMatch.shortMessage
  const message = tti.suggSpec.ltMatch.message
  const replacements = tti.suggSpec.ltMatch.replacements
  
  console.log(tti.suggSpec.ltMatch)
  console.log(tti.suggSpec.ltMatch.rule.issueType, tti.suggSpec.ltMatch.type)

  return (
    <BubbleMenu editor={editor} open={tti.open}>
      <div className='bg-foreground border p-1'>
        <Message className='p-1' text={shortMessage}/>
        <Message className='p-1' text={message}/>
        <Replacements list={replacements} />
      </div>
    </BubbleMenu>
  )
}

export default Tooltip
