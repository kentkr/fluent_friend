
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { Extension } from '@tiptap/core'
import { Plugin,  PluginKey } from 'prosemirror-state'
import api from '../api'

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

    let correction = found[0].type.attrs.correction
    currTooltip.children[0].innerText = correction

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
    changes?: Array<any>;
}

function getCorrections(start: number, text: string): Promise<CorrectionResponse> {
    return api
        .post("/api/get_corrections/", {start: start, text: text})
        .then((res) => res.data as CorrectionResponse)
        .catch((err) => {
            alert(err);
            return { changes_made: false };
        });
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const Suggestion = Extension.create({
    name: 'suggestion',

    addProseMirrorPlugins() {
        const suggestionPlugin = new Plugin({
            key: new PluginKey('suggestion'),
            state: {
                init(_, { doc }) {
                    // init doesnt work with how we update so ignore
                    let decorations: any = []
                    return DecorationSet.create(doc, decorations)
                },

                apply(tr, decorationSet, oldState, newState) {
                    // placeholder logic
                    let decos: any = []
                    let i = 0
                    if (tr.docChanged) {
                        console.log(tr)
                        console.log(tr.steps)
                        for (var step of tr.steps) {
                            step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
                                let start = Math.max(0, newStart)
                                let end = Math.min(newEnd, tr.doc.content.size)
                                let updated_text = tr.doc.textBetween(start, end, '\n', '\t')

                                getCorrections(start, updated_text).then(data => {
                                    console.log(data)
                                    let changes = data.changes
                                    if (changes) {
                                        for (var change of changes) {
                                            console.log(change)
                                            console.log(change[0])
                                            decos.push(
                                                Decoration.inline(
                                                    0, 4,
                                                    {
                                                        class: 'correction-dec',
                                                        correction: change[2]
                                                    }
                                                )
                                            )
                                        }
                                    }
                                })
                            })

                        }
                        console.log('========')
                        console.log(decos.length)
                        decorationSet.add(tr.doc, decos)
                                            decos.push(
                                                Decoration.inline(
                                                    0, 4,
                                                    {
                                                        class: 'correction-dec',
                                                        correction: 'Dont be saying asdf'
                                                    }
                                                )
                                            )
                        return DecorationSet.create(tr.doc, decos)

                        //tr.doc.descendants((node, pos, parent) => {
                        //    if (node.isText) {
                        //        decos.push(
                        //            Decoration.inline(pos, pos+3, {class: 'correction-dec', key: String(i), correction: String(i)}),
                        //        )
                        //        i += 1
                        //    }
                        //})
                        //return DecorationSet.create(tr.doc, decos)
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
                    if (clickedElement && clickedElement.className.includes('correction-dec')) {
                        let currTooltip = document.querySelector('#correction-div') as HTMLElement
                        if (!currTooltip) {
                            currTooltip = initTooltip(currTooltip, view)
                        }
                        console.log(node)

                        let decorationSet = this.getState(view.state)
                        if (decorationSet) {
                            updateTooltip(currTooltip, decorationSet, pos, view)
                        }
                    }
                },
            }
        })

        return [suggestionPlugin]
    }
})

export default Suggestion
