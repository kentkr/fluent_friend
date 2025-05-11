import { useEffect, useRef, useState } from 'react';
import { Editor as TiptapEditor, EditorContent, useEditor, BubbleMenuProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EntryObj } from '../../types/Journal'
import Underline from '@tiptap/extension-underline'
import './Editor.css'
import Suggestion from '../../pm/suggestion';
import { useDebouncedOnUpdate } from '../../utils/debounce';
import { putEntry } from '../../api/journal_entries';

import ControlledBubbleMenu from './ControlledBubbleMenu';
import { ToolTipInfo, SuggSpec } from '../../pm/suggestion.d';
import Tooltip from '../tooltip/Tooltip';

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
  }, 500);

  const [tti, setTti] = useState<ToolTipInfo | undefined>()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Suggestion.configure({
        entryId: currEntry.id,
        retrieveTooltipContents: ({ open, suggSpec }: { open: boolean, suggSpec: SuggSpec }) => {
          setTti(prevTti => ({
            suggSpec: suggSpec,
            open: !prevTti?.open
          }))
          console.log(tti)
        }
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
      <EditorContent editor={editor} className='editor-container-1'/>
    </>
  )
}

// TODO delete
declare global {
    interface Window {
        editor:any;
    }
}

