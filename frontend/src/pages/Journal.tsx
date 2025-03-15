
import StarterKit from '@tiptap/starter-kit'
import { CommandManager, CommandProps, Mark, mergeAttributes } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import JournalList from '../components/JournalList'
import '../styles/Journal.css'
import { Dispatch, SetStateAction, useRef, useCallback } from 'react'
import { Editor as E  } from "@tiptap/react";

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

// api
import api from "../api";
import { useState, useEffect } from 'react'

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
    const [currEntry, setCurrEntry] = useState<EntryObj>({id: -1, user: -1, title: 'w', text: 'w'});

    // on startup fetch entries
    function getEntries() {
        api
            .get("/api/journal_entries/")
            .then((res) => res.data)
            .then((data) => {
                setEntries(data);
                console.log(data);
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
        console.log(entry)
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
    function updateText({ text }: { text: string }) {
        setCurrEntry(prevCurrEntry => ({
            ...prevCurrEntry, text: text
        })) 

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
        console.log('init')
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


function Editor({ currEntry, updateTitle, updateText } : { currEntry: EntryObj, updateTitle: CallableFunction, updateText: CallableFunction }) {
    // debounce on update so we wait to change currEntry
    const onUpdate = useDebouncedOnUpdate(({ editor  }) => {
          updateText({ text: editor.getText()  });
    }, 500);

    // init body editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            SuggestionMark
        ],
        editorProps: {
            attributes: {
                class: 'editor'
            }
        },
        content: `<p>${currEntry.text}</p>`,
        onUpdate: onUpdate
    })


    if (!editor) {
        return null;
    }

    // when currentry changes, dont update the editor if the change came from the editor
    useEffect(() => {
        if (editor.getText() === currEntry.text) {
            return 
        }
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


const SuggestionMark = Mark.create({
    name: 'suggestion',
    addOptions() {
        return {
            HTMLAttributes: {
                class: 'suggestion-text',
            },
        }
    },

    parseHTML() {
        return [{
            tag: 'span.suggestion-text'
        }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0] 
    },

  addCommands() {
    return {
      setSuggestion: () => ({ commands }: CommandProps) => {
        return commands.setMark(this.name)
      },
      unsetSuggestion: () => ({ commands }: CommandProps) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    suggestion: {
      /**
       * Set the suggestion mark
       */
      setSuggestion: () => ReturnType,
      /**
       * Unset the suggestion mark
       */
      unsetSuggestion: () => ReturnType
    }
  }
}
