import { Editor } from "@tiptap/react"
import './EditorMenu.css'
import { EditorStateProps } from '../editor/Editor.d'
import { FaBold, FaItalic, FaStrikethrough } from "react-icons/fa";

function EditorMenu({ editor, editorState }: { editor: Editor, editorState: EditorStateProps }) {
  if (!editor) {
    return null
  }
  return (
    <div className="menu">
      <button
        className={editorState.isBold ? 'menu-button is-active': 'menu-button'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FaBold />
      </button>
      <button
        className={editorState.isItalic ? 'menu-button is-active': 'menu-button'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FaItalic />
      </button>
      <button
        className={editorState.isStrike ? 'menu-button is-active': 'menu-button'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <FaStrikethrough />
      </button>
    </div>
  )
}

export default EditorMenu
