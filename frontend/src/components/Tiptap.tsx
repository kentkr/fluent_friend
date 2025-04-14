
import { useRef, useCallback, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EntryObj } from '../pm/types'
import { Editor } from '@tiptap/react';
import Underline from '@tiptap/extension-underline'
import api from '../api';
import '../styles/Journal1.css'
import Suggestion from '../plugins/Suggestion';

function useDebouncedOnUpdate(
  callback: (params: { editor: Editor; transaction: any }) => void,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(({ editor, transaction }: { editor: Editor; transaction: any }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback({ editor, transaction });
    }, delay);
  }, [callback, delay]);
}

export function TiptapEditor({ 
  currEntry, 
  setCurrEntry, 
  setEntries 
}: 
  { 
    currEntry: EntryObj;
    setCurrEntry: React.Dispatch<React.SetStateAction<EntryObj | undefined>>;
    setEntries: React.Dispatch<React.SetStateAction<EntryObj[]>>;
  }) {

  function updateText({ text }: { text: string }) {
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
    updateText({ text: text });
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

  // if currEntry id changes reset content
  useEffect(() => {
    let tr = editor.state.tr.setMeta('newEntryId', currEntry.id)
    editor.state.apply(tr)
    editor.commands.setContent(currEntry.text)
  }, [currEntry.id])

  return (
    <>
      <EditorContent editor={editor} className='editor-container-1'/>
    </>
  )
}

export function Title({ currEntry, updateTitle }: { currEntry: EntryObj, updateTitle: CallableFunction }) {
  // see Editor for notes
  const onUpdate = useDebouncedOnUpdate(({ editor }) => {
    updateTitle({ title: editor.getText()  });
  }, 500);

  const title = useEditor({
    extensions: [
      StarterKit,
    ],
    content: currEntry.title,
    onUpdate: onUpdate,
    shouldRerenderOnTransaction: false,
  })

  if (!title) {
    return null
  }

  useEffect(() => {
    if (title.getText() === currEntry.title) {
      return 
    }
    title.commands.setContent(currEntry.title)
  }, [currEntry])

  return <EditorContent editor={title}/>
}


