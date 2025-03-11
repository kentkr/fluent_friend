
import StarterKit from '@tiptap/starter-kit'
import { CommandManager, CommandProps, Mark, mergeAttributes } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import JournalList from '../components/JournalList'
import '../styles/Journal.css'

// api
import api from "../api";
import { useState, useEffect } from 'react'

function Journal() {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        getEntries();
    }, []);

    const getEntries = () => {
        api
            .get("/api/journal_entries/")
            .then((res) => res.data)
            .then((data) => {
                setEntries(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    window.tmp = entries;
  return (
      <>
        <div className='page-container'>
            <JournalList entries={entries}/>
            <Editor/>
        </div>
      </>
  )
}


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


declare global {
  interface Window {
    editor: any; // Replace 'any' with a more specific type if possible
    tmp: any;
  }
}


function Editor() {
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
        content: '<p>underline this text</p>',
        onUpdate({ editor, transaction }) {
            // track text/node/mark changes 
            console.log('Editor updated');
            console.log(transaction)
        },
    })

    window.editor = editor;

    if (!editor) {
        return null;
    }

    return (
        <div className='editor-container-0'>
            <h2 className='title'>Title</h2>
            <hr></hr>
            <EditorContent editor={editor} className='editor-container-1'/>
        </div>
    )
}

export default Journal
