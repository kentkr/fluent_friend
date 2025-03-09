
function Journal() {
  return (
      <div className='editor-container-0'>
        <EditorContent editor={editor} className='editor-container-1'/>
      </div>
  )
}

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent } from '@tiptap/react'
import '../styles/Journal.css'


const editor = new Editor({
    extensions: [
        StarterKit
    ],
    editorProps: {
        attributes: {
            class: 'editor'
        }
    },
    content: '<p>underline this text</p>'
})

export default Journal
