import { Replacement } from "../../api/lt.d"
import { ToolTipInfo } from "../../pm/suggestion.d"
import BubbleMenu from "../bubblemenu/BubbleMenu"
import { Editor  } from '@tiptap/react'
import { Range } from '@tiptap/core'
import './Tooltip.css'

function Message({ text, className }: { text: string, className: string }) {
  if (!text) return
  return (
    <p className={className} >{text}</p>
  )
}

function Replacements({ list, range, replaceText }: { list: any[], range: Range, replaceText: CallableFunction }) {
  if (!list || list.length === 0) return

  return (
    <ol className='flex flex-wrap'>
      {list.map((replacement: Replacement) => 
        <li className='p-1' key={replacement.value}>
          <button className='replacement' onClick={() => replaceText(range, replacement.value)}>
            {replacement.value.replace(/^ | $|^$/g, '·')} 
          </button>
        </li>
      )}
      <li>
        <button className="ignore">
          Ignore
        </button>
      </li>
    </ol>
  )
}

function Tooltip ({ editor, tti }: { editor: Editor, tti: ToolTipInfo | undefined }) {
  if (!editor || !tti) return

  const shortMessage = tti.suggSpec.ltMatch.shortMessage
  const message = tti.suggSpec.ltMatch.message
  const replacements = tti.suggSpec.ltMatch.replacements
  //const range = {from: tti.suggSpec.ltMatch.offset, to: tti.suggSpec.ltMatch.offset + tti.suggSpec.ltMatch.length}
  
  // TODO: we can probably put this in Replacements, just pass editor to it
  const range = {
    from: tti.suggSpec.ltMatch.offset+1, 
    to: tti.suggSpec.ltMatch.offset + tti.suggSpec.ltMatch.length+1
  };
  
  function replaceText(range: { from: number, to: number }, replacement: string) {
    try {
      // Make sure both range and replacement are properly defined
      if (range && typeof range.from === 'number' && typeof range.to === 'number' && replacement) {
        editor.commands.insertContentAt(range, replacement);
      } else {
        console.error("Invalid range or replacement", { range, replacement });
      }
    } catch (error) {
      console.error("Error replacing text:", error);
    }
  }

  return (
    <BubbleMenu editor={editor} open={tti.open}>
      <div className='tooltip'>
        <Message className='p-1' text={shortMessage}/>
        <Message className='p-1' text={message}/>
        <Replacements list={replacements} range={range} replaceText={replaceText}/>
      </div>
    </BubbleMenu>
  )
}

export default Tooltip
