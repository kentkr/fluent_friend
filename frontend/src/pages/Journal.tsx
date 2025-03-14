
import StarterKit from '@tiptap/starter-kit'
import { CommandManager, CommandProps, Mark, mergeAttributes } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import JournalList from '../components/JournalList'
import '../styles/Journal.css'
import { Dispatch, SetStateAction, useRef } from 'react'

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

function Journal() {
    const [entries, setEntries] = useState<EntryObj[]>([]);
    const [currEntry, setCurrEntry] = useState<EntryObj>({id: -1, user: -1, title: null, text: null});

    useEffect(() => {
        getEntries();
    }, []);

    // update title or text of current entry if it changes
    const prevTitle = useRef(currEntry.title);
    useEffect(() => {
        if (currEntry.title !== prevTitle.current) {
            setEntries(prevEntries => {
                const updatedEntries = [...prevEntries]
                for (let i = 0; i < updatedEntries.length; i++) {
                    let entry = updatedEntries[i]
                    if (entry.id == currEntry.id) {
                        updatedEntries[i] = { ...updatedEntries[i], title: currEntry.title  }
                    }
                }
                return updatedEntries;
            });
        }
        // update entry
        if (currEntry.id !== -1) {
            console.log(`updating ${currEntry.id}, ${currEntry.title} ${currEntry.text}`)
            api
                .put(`/api/journal_entries/update/${currEntry.id}/`, currEntry)
                .catch((err) => alert(err));
        }

    }, [currEntry])

    const getEntries = () => {
        api
            .get("/api/journal_entries/")
            .then((res) => res.data)
            .then((data) => {
                setEntries(data);
                setCurrEntry(data[0])
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    window.tmp = currEntry;

    function newEntry() {
        console.log('adding new entry')
        api 
            .post("/api/journal_entries/", {})
            .then((res) => res.data)
            .then((data) => {
                setEntries(entries => [...entries, data]);
                console.log(data)
                setCurrEntry(data);
            })
    }

    function deleteEntry({ id }: { id: number }) {
        console.log('deleting entry', id)
        console.log(`/api/journal_entries/delete/${id}/`)
        api 
            .delete(`/api/journal_entries/delete/${id}/`, {})
            .then((res) => res.data)
            .then((data) => {
                setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))
            })
    }

  return (
      <>
        <div className='page-container'>
            <JournalList entries={entries} newEntry={newEntry} deleteEntry={deleteEntry} setCurrEntry={setCurrEntry}/>
            <Editor currEntry={currEntry} setCurrEntry={setCurrEntry}/>
        </div>
      </>
  )
}


function Editor({ currEntry, setCurrEntry } : { currEntry: EntryObj; setCurrEntry: Dispatch<SetStateAction<EntryObj>> }) {
    const prevEditorContent = useRef(currEntry.text);
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
        onUpdate({ editor, transaction }) {
            setCurrEntry(prevCurrEntry => ({
                ...prevCurrEntry, text: editor.getText()
            }))
            prevEditorContent.current = editor.getText()
        },
    })


    if (!editor) {
        return null;
    }

    // on currentry change then set content of editor
    useEffect(() => {
        if (prevEditorContent.current != currEntry.text) {
            editor.commands.setContent(currEntry.text)
            prevEditorContent.current = currEntry.text
        }
    }, [currEntry])

    window.editor = editor;

    return (
        <div className='editor-container-0'>
            <Title currEntry={currEntry} setCurrEntry={setCurrEntry}/>
            <hr></hr>
            <EditorContent editor={editor} className='editor-container-1'/>
        </div>
    )
}

function Title({ currEntry, setCurrEntry } : { currEntry: EntryObj; setCurrEntry: Dispatch<SetStateAction<EntryObj>> }) {
    const prevEditorContent = useRef(currEntry.title);
    const title = useEditor({
        extensions: [
            StarterKit,
        ],
        content: currEntry.title,
        onUpdate({ editor, transaction }) {
            setCurrEntry(prevCurrEntry => ({
                ...prevCurrEntry, title: editor.getText()
            }))
            prevEditorContent.current = editor.getText();
        },
    })

    if (!title) {
        return null
    }

    useEffect(() => {
        if (prevEditorContent.current !== currEntry.title) {
            title.commands.setContent(currEntry.title);
            prevEditorContent.current = currEntry.title;
        }
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
