
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import JournalList from '../components/JournalList'
import '../styles/Journal.css'
import { useRef, useCallback } from 'react'
import { Editor as E  } from "@tiptap/react";
import Suggestion from '../plugins/Suggestion'
import api from "../api";
import { useState, useEffect } from 'react'
import { SerialDecoration } from '../pm/types'


// debounce update for editor to avoid overwriting text as its typed
function useDebouncedOnUpdate(
    callback: (params: { editor: E; transaction: any }) => void,
    delay: number
) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(({ editor, transaction }: { editor: E; transaction: any }) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback({ editor, transaction });
        }, delay);
    }, [callback, delay]);
}

export interface EntryObj {
    id: number;
    user: number;
    title: string | null;
    text: string | null;
} 

interface Entries {
    entries: Array<EntryObj | null>
}

// actual journal page
function Journal() {
    const [entries, setEntries] = useState<EntryObj[]>([]);
    // TODO: update default entry
    const [currEntry, setCurrEntry] = useState<EntryObj>({id: -1, user: -1, title: 'w', text: 'waaaaaaaaaa'});

    // on startup fetch entries
    function getEntries() {
        api
            .get("/api/journal_entries/")
            .then((res) => res.data)
            .then((data) => {
                setEntries(data);
            })
            .catch((err) => alert(err));
        // if no entries create a new one
        if (!entries) {
            newEntry()
        }
    }

    // create new entry
    function newEntry() {
        api 
            .post("/api/journal_entries/", {})
            .then((res) => res.data)
            .then((data) => {
                setEntries(entries => [...entries, data]);
                setCurrEntry(data);
            })
        // TODO: make new entry have a default value
    }

    // delete entry 
    function deleteEntry({ id }: { id: number }) {
        api 
            .delete(`/api/journal_entries/delete/${id}/`, {})
            .then((res) => res.data)
            .then((data) => {
                setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))
            })
    }

    // grab en entry to set as curr
    function selectEntry({ entry }: { entry: EntryObj }) {
        setCurrEntry(entry)
    }

    // set title for currEntry, entries, and the db
    function updateTitle({ title }: { entry_id: number, title: string }) {
        setCurrEntry(prevCurrEntry => ({
            ...prevCurrEntry, title: title
        })) 

        setEntries(prevEntries =>
            prevEntries.map(entry =>
                entry.id === currEntry.id ? { ...entry, title: title } : entry
            )
        );

        let updatedEntry = currEntry
        updatedEntry.title = title
        api
            .put(`/api/journal_entries/update/${currEntry.id}/`, updatedEntry)
            .catch((err) => alert(err));
    }

    // set body text for currEntry, entries, and the db
    function updateText({ text, decs }: { text: string, decs: SerialDecoration[] }) {
        setCurrEntry(prevCurrEntry => ({
            ...prevCurrEntry, text: text
        })) 

      console.log('serial decs: ', decs)

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

    // initially load entries
    useEffect(() => {
        getEntries();
    }, []);

    window.tmp = currEntry

  return (
      <>
        <div className='page-container'>
            <JournalList entries={entries} newEntry={newEntry} deleteEntry={deleteEntry} selectEntry={selectEntry}/>
            <Editor currEntry={currEntry} updateTitle={updateTitle} updateText={updateText}/>
        </div>
      </>
  )
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Suggestion: {
      /**
       * Comments will be added to the autocomplete.
       */
      writeSerialDecs: () => ReturnType
    }
  }
}

function Editor({ currEntry, updateTitle, updateText } : { currEntry: EntryObj, updateTitle: CallableFunction, updateText: CallableFunction }) {
    // debounce on update so we wait to change currEntry
    const onUpdate = useDebouncedOnUpdate(({ editor }) => {
      let text = editor.getHTML()
      let decs = editor.commands.writeSerialDecs()
          updateText({ text: text, decs: decs });
    }, 500);

    // init body editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Suggestion,
        ],
        editorProps: {
            attributes: {
                class: 'editor'
            }
        },
        content: `<p>${currEntry.text}</p>`,
        onUpdate: onUpdate,
        shouldRerenderOnTransaction: false,
        onCreate: ({ editor }) => {
            let tr = editor.state.tr.setMeta('entryId', currEntry.id)
            editor.state.apply(tr)
        }
    })
    window.editor = editor;

    if (!editor) {
        return null;
    }

    // when currentry changes, dont update the editor if the change came from the editor
    useEffect(() => {
        if (editor.getHTML() === currEntry.text) {
            return 
        }
        let tr = editor.state.tr.setMeta('entryId', currEntry.id)
        editor.state.apply(tr)
        editor.commands.setContent(currEntry.text)
    }, [currEntry])

    return (
        <div className='editor-container-0'>
            <Title currEntry={currEntry} updateTitle={updateTitle}/>
            <hr></hr>
            <EditorContent editor={editor} className='editor-container-1'/>
        </div>
    )
}

function Title({ currEntry, updateTitle }: { currEntry: EntryObj, updateTitle: CallableFunction }) {
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

export default Journal

declare global {
  interface Window {
    editor: any; // Replace 'any' with a more specific type if possible
    tmp: any;
  }
}

