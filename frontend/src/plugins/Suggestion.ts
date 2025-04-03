
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { Extension } from '@tiptap/core'
import { Plugin,  PluginKey, Transaction, EditorState } from 'prosemirror-state'
import { Node } from 'prosemirror-model'
import api from '../api'

let EditorViewVar: EditorView;

function initTooltip(currTooltip: HTMLElement, view: EditorView): HTMLElement {
    // initiate tooltip html element
    currTooltip = document.createElement('div')
    currTooltip.className = 'correction-div'
    currTooltip.style.display = 'none'
    currTooltip.id = 'correction-div'
    let innerDiv = document.createElement('div')
    innerDiv.innerText = 'balalala'
    innerDiv.className = 'correction'
    currTooltip.appendChild(innerDiv)
    if (view.dom.parentNode) {
        view.dom.parentNode.appendChild(currTooltip)
    }
    return currTooltip
}

function updateTooltip(
    currTooltip: HTMLElement, 
    decorationSet: DecorationSet, 
    pos: number, 
    view: EditorView
): HTMLElement {
    // update position and text of tooltip
    currTooltip.style.display = currTooltip.style.display === 'none' ? 'block' : 'none'

    const found = decorationSet.find(pos, pos)

    let correction = found[0].spec.correction
    let child = currTooltip.children[0] as HTMLElement
    child.innerText = correction

    let start = view.coordsAtPos(found![0].from)
    let end = view.coordsAtPos(found![0].to)
    let curr = currTooltip.getBoundingClientRect() 
    // half of text box - mid point of dec
    let midOffset = (curr.right - curr.left) / 2 - (end.right - start.left) + 3
    currTooltip.style.left = start.left - midOffset + 'px'
    currTooltip.style.top = (end.bottom + 5) + 'px'
    return currTooltip
}

interface CorrectionResponse {
    changes_made: boolean;
    changes: any[];
}

function getCorrections(start: number, text: string): Promise<CorrectionResponse> {
    return api
        .post("/api/get_corrections/", {start: start, text: text})
        .then((res) => res.data as CorrectionResponse)
        .catch((err) => {
            alert(err);
            return { changes_made: false, changes: [] };
        });
}

function debounceDecorateNodes(
    callback: (params: {start: number; text: string}) => void,
    delay: number
) {
    let timeoutId: NodeJS.Timeout | null = null;
    let state = {
        start: Number.POSITIVE_INFINITY,
        text: ''
    };

    return ({ start, text }: { start: number; text: string }) => {
        // Update state with the new values
        state.start = Math.min(state.start, start);
        state.text += text;

        // Clear any pending timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            // Pass the accumulated state to callback
            callback({ 
                start: state.start, 
                text: state.text 
            });
            
            // Reset state after callback
            state = {
                start: Number.POSITIVE_INFINITY,
                text: ''
            };
        }, delay);
    };
}

class DecHandler {
    decSet: Set<Decoration>;
    entryId: number;

    constructor() {
        this.decSet = new Set()
        this.entryId = -1
    }

    trToDec(tr: Transaction) {
        tr.mapping.maps.forEach((stepMap, index, array) => {
            stepMap.forEach((from, to) => {
                let resolved = tr.doc.resolve(from)
                let parent = resolved.parent
                let parentStart = resolved.pos-resolved.parentOffset
                this.decorateNodes(parentStart, parent.textContent)
            })
        })
    }

    flush() {
        this.decSet.clear()
        console.log('setting ', this.decSet)
        EditorViewVar.dispatch(EditorViewVar.state.tr.setMeta('asyncDecorations', this.decSet))
    }

    async decorateNodes(start: number, text: string): Promise<void> {
        let corrections: CorrectionResponse
        try {
            let res = await api.post("/api/get_corrections/", {start: start, text: text})
            corrections = res.data
        } catch (err) {
            alert(err)
            corrections = { changes_made: false , changes: []}
        }
    
        let decos: Decoration[] = []
        if (corrections.changes && corrections.changes.length === 1) {
            console.log(corrections)
        }
        if (corrections.changes) {
            for (var correction of corrections.changes) {
                let d = Decoration.inline(
                    correction[0], 
                    correction[1], 
                    { class: 'correction-dec' },
                    { correction: correction[2] }
    
                )
                if (d) {
                    this.decSet.add(d)
                }
                decos.push(d)
            }
        }
        //console.log(decos)
        //console.log(this.decSet)
        let tmp = [...this.decSet]
        console.log('new decs:', tmp)
        EditorViewVar.dispatch(EditorViewVar.state.tr.setMeta('asyncDecorations', tmp))
    }
}

let decHandler = new DecHandler()

const Suggestion = Extension.create({
    name: 'suggestion',

    addProseMirrorPlugins() {
        const suggestionPlugin = new Plugin({
            key: new PluginKey('suggestion'),
            state: {
                init(_, { doc }) {
                    // init doesnt work with how we update so ignore
                    return DecorationSet.create(doc, [])
                },

                apply(tr, decorationSet, oldState, newState) {
                    // placeholder logic
                    if (tr.docChanged) {
                        decHandler.trToDec(tr)
                    }

                    let entryId = tr.getMeta('entryId')
                    if (entryId && entryId != decHandler.entryId) {
                        console.log('flushing')
                        let newDecorationSet = decorationSet.remove(decorationSet.find())
                        console.log(newDecorationSet)
                        decHandler.flush()
                        return newDecorationSet
                    }
                    const asyncDecs = tr.getMeta('asyncDecorations')
                    if (asyncDecs) {
                        return decorationSet.add(tr.doc, asyncDecs)
                    }
                    return decorationSet.map(tr.mapping, tr.doc)
                },
            },
            
            props: {
                decorations(state) {
                    return this.getState(state)
                },

                handleClickOn(view, pos, node, nodePos, event, direct) {
                    const clickedElement = event.target as HTMLElement
                    if (clickedElement && clickedElement.className.includes('correction-dec')) {
                        let currTooltip = document.querySelector('#correction-div') as HTMLElement
                        if (!currTooltip) {
                            currTooltip = initTooltip(currTooltip, view)
                        }

                        let decorationSet = this.getState(view.state)
                        if (decorationSet) {
                            updateTooltip(currTooltip, decorationSet, pos, view)
                        }
                    }
                },
            },
            view: function(view) {
                return {
                    update(view, prevState) {
                        EditorViewVar = view;
                    },
                }
            },
        })

        const FUCK = new Plugin({
            key: new PluginKey('FUCK'),
            state: {
                    init(_, { doc }) {
                        let fuck: Fuck = {fuck: {}, decorationSet: DecorationSet.create(doc, [])}
                        return fuck
                    },
                    apply(tr, fuck, oldState, newState) {
                        return fuck
                    }
                }
        })

        return [suggestionPlugin, FUCK]
    }
})

export default Suggestion

interface Fuck {
    fuck: {},
    decorationSet: DecorationSet
}

interface Fuck {
    fuck: {},
    decorationSet: DecorationSet
}

