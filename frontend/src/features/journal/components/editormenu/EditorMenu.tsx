import { Editor } from "@tiptap/react"
import './EditorMenu.css'
import { EditorStateProps } from '../editor/Editor.d'
import { FaBold, FaItalic, FaStrikethrough } from "react-icons/fa";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { languageMap } from '../../lt/lt'
import { LtLanguage } from "../../lt/lt.d";

function EditorMenu({ editor, editorState }: { editor: Editor, editorState: EditorStateProps }) {
  if (!editor) {
    return null
  }
  const [language, setLanguage] = useState('auto')

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="menu">
      <div>
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
<FormControl fullWidth>
  <InputLabel id='language-label'>Language</InputLabel>
  <Select
    labelId="language-select-label"
    id='language-select'
    value={language} // Convert 'auto' to empty string
    label='Language'
    onChange={handleChange}
  >
    <MenuItem key='auto' value='auto'>
      <em>Auto</em>
    </MenuItem>
    
    {Array.from(languageMap.keys()).map((key) => (
      <MenuItem key={key} value={key}>{key}</MenuItem>
    ))}
  </Select>
</FormControl>
    </div>
  )
}

export default EditorMenu

