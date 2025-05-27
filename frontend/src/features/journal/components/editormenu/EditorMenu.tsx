import { Editor } from "@tiptap/react"
import './EditorMenu.css'
import { EditorStateProps } from '../editor/Editor.d'
import { FaBold, FaItalic, FaStrikethrough } from "react-icons/fa";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { languageMap } from '../../lt/lt'
import {EntryObj} from "../../types/Journal";
import {updateEntry} from "../../api/journal_entries";

function EditorMenu({ 
  editor, 
  editorState, 
  currEntry, 
  setCurrEntry 
}: { 
  editor: Editor, 
  editorState: EditorStateProps,
  currEntry: EntryObj,
  setCurrEntry: React.Dispatch<React.SetStateAction<EntryObj | undefined>>
}) {
  if (!editor || !currEntry) {
    return null
  }
  //const [language, setLanguage] = useState<string>('auto')
  //const [nativeLanguage, setNativeLanguage] = useState<string | null>(null)

  const languageChange = (event: SelectChangeEvent) => {
    setCurrEntry((prevEntry) => {
      if (!prevEntry) return prevEntry
      return { ...prevEntry, language: event.target.value }
    })
    updateEntry({id: currEntry.id, language: event.target.value}) 
  };

  const nativeLanguageChange = (event: SelectChangeEvent) => {
    setCurrEntry((prevEntry) => {
      if (!prevEntry) return prevEntry
      return { ...prevEntry, nativeLanguage: event.target.value }
    });
    updateEntry({id: currEntry.id, nativeLanguage: event.target.value}) 
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
      {/* language selector */}
      <FormControl >
        <InputLabel id='language-label'>Language</InputLabel>
        <Select
          labelId="language-select-label"
          id='language-select'
          value={currEntry.language} 
          label='Language'
          onChange={languageChange}
        >
          <MenuItem key='auto' value='auto'>
            <em>Auto</em>
          </MenuItem>
          {Array.from(languageMap.keys()).map((key) => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* native language selector */}
      <FormControl >
        <InputLabel id='language-label'>Native Language</InputLabel>
        <Select
          labelId="native-language-select-label"
          id='native-language-select'
          value={currEntry.nativeLanguage === undefined || currEntry.nativeLanguage === null? 'None' : currEntry.nativeLanguage} 
          label='Native Language'
          onChange={nativeLanguageChange}
        >
          <MenuItem key='null' value={'None'}>
            <em>None</em>
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

