
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { Extension } from '@tiptap/core'
import { Plugin,  PluginKey } from 'prosemirror-state'

function initTooltip(currTooltip: HTMLElement, view: EditorView): HTMLElement {
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

function getTooltipDiv(innerText: string) {
    let div = `
        <div class="correction-div">
            <div>${innerText}</div>
        </div>
    `
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
                        tr.doc.descendants((node, pos, parent) => {
                            if (node.isText) {
                                decos.push(
                                    Decoration.inline(pos, pos+1, {class: 'correction-dec', key: String(i), correction: String(i)}),
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
