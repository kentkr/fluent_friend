import { useState } from 'react';
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EntryObj } from '../../types/Journal'
import './Editor.css'
import Suggestion from '../../pm/suggestion';
import { useDebouncedOnUpdate } from '../../utils/debounce';
import { updateEntry } from '../../api/journal_entries';
import { ToolTipInfo, UpdateTooltipProps } from '../../pm/suggestion.d';
import Tooltip from '../tooltip/Tooltip';
import EditorMenu from '../editormenu/EditorMenu';
import { EditorStateProps } from './Editor.d'
import { JOURNAL_EDITOR_PLACEHOLDER } from '../../../../constants';

const DEBOUNCE_MS= 500;

// add language/native language to db
// 
export function Editor({ 
  currEntry, 
  setCurrEntry, 
  setEntries 
}: 
  { 
    currEntry: EntryObj;
    setCurrEntry: React.Dispatch<React.SetStateAction<EntryObj | undefined>>;
    setEntries: React.Dispatch<React.SetStateAction<EntryObj[]>>;
  }) {

  function updateEditor({ text }: { text: string }) {
    if (!currEntry.id) return
    setCurrEntry(prevCurrEntry => {
      if (!prevCurrEntry) return; // Handle the undefined case
      return { ...prevCurrEntry, text: text };
    });

    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === currEntry.id ? { ...entry, text: text } : entry
      )
    );

    let updatedEntry = currEntry
    updatedEntry.text = text
    updateEntry(currEntry)
  }

  const onUpdate = useDebouncedOnUpdate(({ editor }) => {
    let text = editor.getHTML()
    updateEditor({ text: text });
  }, DEBOUNCE_MS);

  // hold only the state for the tooltip
  const [tti, setTti] = useState<ToolTipInfo | undefined>()

  function updateTooltip({ suggDec, open }: UpdateTooltipProps): void {
    setTti(prevTti => ({
      suggDec: suggDec,
      open: open
    }))
  }

  function toggleTooltip(): void {
    setTti(prevTti => {
      if (!prevTti) return undefined
      return {
        suggDec: prevTti.suggDec,
        open: !prevTti.open
      }
    })
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: JOURNAL_EDITOR_PLACEHOLDER
      }),
      Suggestion.configure({
        entryId: currEntry.id,
        updateTooltip: updateTooltip,
        language: currEntry.language,
        nativeLanguage: currEntry.nativeLanguage
      }),

    ],
    content: currEntry.text,
    editorProps: {
      attributes: {
        class: 'editor',
        spellcheck: 'false',
      }
    },
    onUpdate: onUpdate,
    onCreate: ({ editor }) => {
      let tr = editor.state.tr.setMeta('onCreate', currEntry.id)
      editor.state.apply(tr)
    },
    shouldRerenderOnTransaction: false,
    parseOptions: {
      preserveWhitespace: 'full'
    },
    // when entry id changes recreate
    // TODO: make a more permanent fix for this, lang and native lang
    // evaluate if repainting the editor is fine or if we need
    // to update decHandler more directly
  }, [currEntry.id, currEntry.language, currEntry.nativeLanguage])

  if (!editor) {
    return
  }

  // from https://tiptap.dev/docs/examples/advanced/react-performance
  // menu bar
  const currentEditorState = useEditorState<EditorStateProps>({
      editor,
      selector: ctx => ({
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
      }),
      equalityFn: (prev, next) => {
        // A deep-equal function would probably be more maintainable here, but, we use a shallow one to show that it can be customized.
        if (!next) {
          return false
        }
        return (
          prev.isBold === next.isBold
          && prev.isItalic === next.isItalic
          && prev.isStrike === next.isStrike
        )
      },
    })

  return (
    <>
      <Tooltip editor={editor} tti={tti} toggleTooltip={toggleTooltip} />
      {
        currentEditorState && 
        <EditorMenu editor={editor} editorState={currentEditorState} currEntry={currEntry} setCurrEntry={setCurrEntry}/>
      }
      <EditorContent editor={editor} className='editor-container-1' spellCheck={false}/>
    </>
  )
}

// TODO delete
declare global {
    interface Window {
        editor:any;
    }
}

