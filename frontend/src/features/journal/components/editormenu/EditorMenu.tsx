import { Editor } from "@tiptap/react"
import './EditorMenu.css'
import { EditorStateProps } from '../editor/Editor.d'
import { languageMap } from '../../lt/lt'
import {EntryObj} from "../../types/Journal";
import {updateEntry} from "../../api/journal_entries";
import { FaBold, FaItalic, FaStrikethrough } from "react-icons/fa";
import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  SelectChangeEvent, 
  Tooltip, 
  Divider,
} from "@mui/material";
import { 
  selectAndMenuSx, 
  menuProps, 
  formSx, 
  labelSx,
  dividerSx,
} from "./muisx"; 


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
      <div className="flex items-center">
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
      <Divider orientation="vertical" flexItem sx={dividerSx} />
      {/* language selector */}
      <FormControl size='small' sx={formSx}>
        <Tooltip title='Language' >
          <InputLabel id='language-label' sx={labelSx}>Language</InputLabel>
        </Tooltip>
        <Select
          labelId="language-label"
          id='language-select'
          value={currEntry.language} 
          label='Language'
          onChange={languageChange}
          sx={selectAndMenuSx}
          MenuProps={menuProps}
        >
          <MenuItem key='auto' value='auto' sx={selectAndMenuSx}>
            <em>Auto</em>
          </MenuItem>
          {Array.from(languageMap.keys()).map((key) => (
            <MenuItem key={key} value={key} sx={selectAndMenuSx}>{key}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* native language selector */}
      <FormControl size="small" sx={formSx}>
        <Tooltip title='Native Language' >
          <InputLabel id='native-language-label' sx={labelSx}>Native Language</InputLabel>
        </Tooltip>
        <Select
          labelId="native-language-label"
          id='native-language-select'
          value={currEntry.nativeLanguage === undefined || currEntry.nativeLanguage === null? 'None' : currEntry.nativeLanguage} 
          label='Native Language'
          onChange={nativeLanguageChange}
          sx={selectAndMenuSx}
          MenuProps={menuProps}
        >
          <MenuItem key='null' value={'None'} sx={selectAndMenuSx} >
            <em>None</em>
          </MenuItem>
          {Array.from(languageMap.keys()).map((key) => (
            <MenuItem key={key} value={key} sx={selectAndMenuSx} >{key}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default EditorMenu

