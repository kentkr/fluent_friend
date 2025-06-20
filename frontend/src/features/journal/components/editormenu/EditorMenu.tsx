import { Editor } from "@tiptap/react"
import './EditorMenu.css'
import { EditorStateProps } from '../editor/Editor.d'
import {EntryObj} from "../../types/Journal";
import {updateEntry} from "../../api/journal_entries";
import { FaBold, FaItalic, FaStrikethrough } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import VerticalDivider from "../../../../components/verticaldivider/VerticalDivider";
import SelectDropdown from "../../../../components/selectdropdown/SelectDropdown";
import { languageList, languageMap, nativeLanguageList, nativeLanguageMap } from "../../lt/lt";


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

  const languageChange = (selection: string): void => {
    const langCode = languageMap.get(selection)
    setCurrEntry((prevEntry) => {
      if (!prevEntry) return prevEntry
      return { ...prevEntry, language: langCode }
    })
    updateEntry({id: currEntry.id, language: langCode}) 
  };

  const nativeLanguageChange = (selection: string): void => {
    let langCode = nativeLanguageMap.get(selection)!
    setCurrEntry((prevEntry) => {
      if (!prevEntry) return prevEntry
      return { ...prevEntry, nativeLanguage: langCode }
    });
    updateEntry({ id: currEntry.id, nativeLanguage: langCode }) 
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
      <VerticalDivider />
      <SelectDropdown 
        icon={<FaGlobeAmericas/>} 
        onSelect={languageChange} 
        inputList={languageList} 
        currentSelection={currEntry.language!}
      />
      <SelectDropdown 
        icon={<FaHome />} 
        onSelect={nativeLanguageChange} 
        inputList={nativeLanguageList}
        currentSelection={currEntry.nativeLanguage!}
        />
    </div>
  )
}

export default EditorMenu

