import api from '../../../../api';
import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EntryObj } from '../../types/Journal'
import Underline from '@tiptap/extension-underline'
import './Editor.css'
import Suggestion from '../../pm/suggestion';
import { useDebouncedOnUpdate } from '../../utils/debounce';

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
    api
      .put(`/api/journal_entries/update/${currEntry.id}/`, updatedEntry)
      .catch((err) => alert(err));
  }

  const onUpdate = useDebouncedOnUpdate(({ editor }) => {
    let text = editor.getHTML()
    updateEditor({ text: text });
  }, 500);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Suggestion
    ],
    content: `<p>${currEntry.text}</p>`,
    editorProps: {
      attributes: {
        class: 'editor'
      }
    },
    shouldRerenderOnTransaction: false,
    onUpdate: onUpdate,
    onCreate: ({ editor }) => {
      let tr = editor.state.tr.setMeta('newEntryId', currEntry.id)
      editor.state.apply(tr)
    }
  })

  if (!editor) {
    return
  }

  window.editor = editor

  // if currEntry id changes reset content
  useEffect(() => {
    let tr = editor.state.tr.setMeta('newEntryId', currEntry.id)
    editor.state.apply(tr)
    editor.commands.setContent(currEntry.text, false,  { preserveWhitespace: true } )
  }, [currEntry.id])

  return (
    <>
      <EditorContent editor={editor} className='editor-container-1'/>
    </>
  )
}

declare global {
    interface Window {
        editor:any;
    }
}
