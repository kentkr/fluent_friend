
import StarterKit from '@tiptap/starter-kit'
import { CommandManager, CommandProps, Mark, mergeAttributes } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import JournalList from '../components/JournalList'
import '../styles/Journal.css'
import { Dispatch, SetStateAction, useRef, useCallback, createElement } from 'react'
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
          updateText({ text: editor.getHTML()  });
    }, 500);

    // init body editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Suggestion
            //SuggestionMark,
            //Highlight.configure({
            //    multicolor: true,
            //    HTMLAttributes: {class: 'x'}
            //}),
            //SelectionTooltipExtension
        ],
        editorProps: {
            attributes: {
                class: 'editor'
            }
        },
        content: `<p>${currEntry.text}</p>`,
        onUpdate: onUpdate,
        shouldRerenderOnTransaction: false,
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
      highlight: {
          setHighlight: (attributes?: { color: string }) => ReturnType,
      }
  }
}

export interface HighlightOptions {
      /**
       *    * Allow multiple highlight colors
       *       * @default false
       *          * @example true
       *             */
      multicolor: boolean,

      /**
       *    * HTML attributes to add to the highlight element.
       *       * @default {}
       *          * @example { class: 'foo'  }
       *             */
      HTMLAttributes: Record<string, any>,

}

const Highlight = Mark.create<HighlightOptions>({
    name: 'highlight',

    addOptions() {
        return {
            multicolor: false,
            HTMLAttributes: {},
        }
    },

    addAttributes() {
        if (!this.options.multicolor) {
            return {}
        }

        return {
            color: {
                default: '#fffff',
                parseHTML: element => element.getAttribute('data-color') || element.style.backgroundColor,
                renderHTML: attributes => {
                    if (!attributes.color) {
                        return {}
                    }

                    return {
                        'data-color': attributes.color,
                        style: `background-color: ${attributes.color}; color: inherit`,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            { tag: 'mark' }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        console.log(this.options.HTMLAttributes)

        return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addCommands() {
        return {
            setHighlight: attributes => ({ commands }: CommandProps) => {
                return commands.setMark(this.name, attributes)
            }
        }
    }
})

import { Plugin, PluginView, EditorState, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

class SelectionTooltip implements PluginView {
  private tooltip: HTMLDivElement;

  constructor(view: EditorView) {
    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    
    // Make sure there's a parent node before appending
    if (view.dom.parentNode) {
      view.dom.parentNode.appendChild(this.tooltip);
    }
    
    this.update(view, null);
      console.log('constructing')
  }

  update(view: EditorView, lastState: EditorState | null): void {
    const state = view.state;
    
    // Don't do anything if the document/selection didn't change
    if (lastState && lastState.doc.eq(state.doc) &&
        lastState.selection.eq(state.selection)) return;
    
    // Hide the tooltip if the selection is empty
    if (state.selection.empty) {
      this.tooltip.style.display = "none";
      return;
    }
    
    // Otherwise, reposition it and update its content
    this.tooltip.style.display = "";
    const {from, to} = state.selection;
    
    // These are in screen coordinates
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    
    // The box in which the tooltip is positioned, to use as base
    const offsetParent = this.tooltip.offsetParent as HTMLElement;
    if (!offsetParent) return;
    
    const box = offsetParent.getBoundingClientRect();
    
    // Find a center-ish x position from the selection endpoints
    const left = Math.max((start.left + end.left) / 2, start.left + 3);
    this.tooltip.style.left = (left - box.left) + "px";
    this.tooltip.style.bottom = (box.bottom - start.top) + "px";
    this.tooltip.textContent = String(to - from);
  }

  destroy(): void {
    this.tooltip.remove();
  }
}

const TooltipPlugin = new Plugin({
  view(editorView: EditorView): PluginView {
    return new SelectionTooltip(editorView);
  }
});

import { Extension } from '@tiptap/core'

// Create a Tiptap extension that adds our ProseMirror plugin
export const SelectionTooltipExtension = Extension.create({
  name: 'selectionTooltip',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        view(editorView: EditorView): PluginView {
          return new SelectionTooltip(editorView);
        }
      })
    ]
  },
})

import { Decoration, DecorationSet } from 'prosemirror-view'

const Suggestion = Extension.create({
    name: 'suggestion',

    addProseMirrorPlugins() {
        const suggestionPlugin = new Plugin({
            key: new PluginKey('suggestion'),
            state: {
                init(_, { doc }) {
                    // init doesnt work with how we update so ignore
                    let decorations: any = []
                    //for (let pos = 1; pos < doc.content.size; pos += 4) {
                    //    console.log(pos)
                    //    //Decoration.inline(pos-1, pos, {class: 'suggestion'})
                    //    const el = document.createElement('div')
                    //    el.className = 'suggestion'
                    //    el.textContent = 'widget'
                    //    decorations.push(Decoration.widget(pos, el))
                    //}
                    return DecorationSet.create(doc, decorations)
                },

                apply(tr, decorationSet, oldState, newState) {
                    let decos: any = []
                    let i = 0
                    if (tr.docChanged) {
                        tr.doc.descendants((node, pos, parent) => {
                            if (node.isText) {
                                decos.push(
                                    Decoration.inline(pos, pos+1, {class: 'suggestion', key: String(i)}),
                                    Decoration.widget(pos, randomDiv({parentKey: String(i)}))
                                )
                                i += 1
                            }
                        })
                        return DecorationSet.create(tr.doc, decos)
                    }
                    return decorationSet.map(tr.mapping, tr.doc)
                }
            },
            
            props: {
                decorations(state) {
                    return this.getState(state)
                },
                handleClickOn(view, pos, node, nodePos, event, direct) {
                    const clickedElement = event.target as HTMLElement
                    if (clickedElement && clickedElement.className.includes('suggestion')) {
                        let key = clickedElement.getAttribute('key')
                        let rect = clickedElement.getBoundingClientRect()
                        console.log(rect)
                        if (key) {
                            let el = document.querySelector(`[parentKey="${key}"]`) as HTMLElement
                            if (el) {
                                console.log(el.getBoundingClientRect())
                                el.style.display = el.style.display === 'none' ? 'block' : 'none'

                                // Get coordinates and positions
                                let relCoords = view.coordsAtPos(pos);
                                let viewportHeight = window.innerHeight;
                                let tooltipHeight = el.offsetHeight;
                                
                                // Determine if there's enough space below
                                let spaceBelow = viewportHeight - rect.bottom;
                                let spaceNeeded = tooltipHeight + 10; // 10px buffer
                                
                                if (spaceBelow >= spaceNeeded) {
                                    // Position below
                                    el.style.top = (rect.bottom + 5) + 'px';
                                    el.classList.remove('tooltip-above');
                                    el.classList.add('tooltip-below');
                                } else {
                                    // Position above
                                    el.style.top = (rect.top - tooltipHeight - 5) + 'px';
                                    el.classList.remove('tooltip-below');
                                    el.classList.add('tooltip-above');
                                }
                            }
                        }
                    }
                    // handleClick
                    // this is useful for adding our own floating window
                    //if (/suggestion/.test(event.target.className)) {
                    //    let { from, to } = view.state.selection
                    //    console.log(from, to)
                    //    console.log(view.coordsAtPos(from))
                    //    console.log('clicked', pos) 
                    //}
                },
            }
        })

        return [suggestionPlugin]
    }
})

function randomDiv(prob: any) {
    return () => {
        let icon = document.createElement('div')
        icon.className = 'icon'
        icon.title = 'msg'
        icon.style.position = 'absolute'
        icon.style.display = 'none'
        icon.innerText = 'blabalba'
        icon.setAttribute('parentKey', prob.parentKey)
        return icon
    }
}

