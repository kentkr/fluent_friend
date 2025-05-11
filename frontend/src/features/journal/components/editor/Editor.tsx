import { useState } from 'react';
import { Editor as TiptapEditor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EntryObj } from '../../types/Journal'
import Underline from '@tiptap/extension-underline'
import './Editor.css'
import Suggestion from '../../pm/suggestion';
import { useDebouncedOnUpdate } from '../../utils/debounce';
import { putEntry } from '../../api/journal_entries';
import { ToolTipInfo, UpdateTooltipProps } from '../../pm/suggestion.d';
import Tooltip from '../tooltip/Tooltip';

const DEBOUNCE_MS= 1000;

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
    putEntry(currEntry)
  }

  const onUpdate = useDebouncedOnUpdate(({ editor }) => {
    let text = editor.getHTML()
    updateEditor({ text: text });
  }, DEBOUNCE_MS);

  // hold only the state for the tooltip
  const [tti, setTti] = useState<ToolTipInfo | undefined>()

  function updateTooltip({ suggSpec }: UpdateTooltipProps): void {
    setTti(prevTti => ({
      suggSpec: suggSpec,
      open: !prevTti?.open
    }))
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Suggestion.configure({
        entryId: currEntry.id,
        updateTooltip: updateTooltip        
      }),
    ],
    content: currEntry.text,
    editorProps: {
      attributes: {
        class: 'editor'
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
  }, [currEntry.id])

  if (!editor) {
    return
  }

  return (
    <>
      <Tooltip editor={editor} tti={tti} />
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

