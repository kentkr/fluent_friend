
import { DecorationSet, EditorView } from 'prosemirror-view'
import { Extension } from '@tiptap/core'
import { Plugin,  PluginKey } from 'prosemirror-state'
import DecHandler from '../pm/dec_handler'

// TODO: get a more robust way to make this part of the class state
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

class SuggestionState {
  decHandler: DecHandler
  decorationSet: DecorationSet

  constructor(decorationSet: DecorationSet, editorView: EditorView) {
    this.decHandler = new DecHandler(decorationSet, editorView)
    this.decorationSet = decorationSet
  }

}

const suggestionKey = new PluginKey('suggestion')

const Suggestion = Extension.create({
  name: 'suggestion',

  addProseMirrorPlugins() {
    const suggestionPlugin = new Plugin({
      key: suggestionKey,
      state: {
        init(_, { doc }) {
          let decorationSet = DecorationSet.create(doc, [])
          return new SuggestionState(decorationSet, EditorViewVar)
        },

        apply(tr, suggState, oldState, newState) {
          let changes; 
          // placeholder logic
          if (tr.docChanged) {
            // TODO find a way to not set this constantly
            //decHandler.trToDec(tr)
            suggState.decHandler.editorView = EditorViewVar
            suggState.decHandler.update(tr)
            suggState.decHandler.serialize()
          }

          let entryId = tr.getMeta('entryId')
          if (entryId && entryId != suggState.decHandler.entryId) {
            suggState.decHandler.decSet = suggState.decHandler.decSet.remove(suggState.decHandler.decSet.find())
            suggState.decHandler.flush()
            return suggState
          }

          const asyncDecs = tr.getMeta('asyncDecorations')
          if (asyncDecs) {
            suggState.decHandler.decSet = suggState.decHandler.decSet.add(tr.doc, asyncDecs)
            return suggState
          }
          suggState.decHandler.decSet = suggState.decHandler.decSet.map(tr.mapping, tr.doc)
          return suggState
        },
      },

      props: {
        decorations(state) {
          let suggState = this.getState(state)
          return suggState?.decHandler.decSet
        },

        handleClickOn(view, pos, node, nodePos, event, direct) {
          const clickedElement = event.target as HTMLElement
          if (clickedElement && clickedElement.className.includes('correction-dec')) {
            let currTooltip = document.querySelector('#correction-div') as HTMLElement
            if (!currTooltip) {
              currTooltip = initTooltip(currTooltip, view)
            }

            let suggState = this.getState(view.state)
            let decorationSet = suggState?.decorationSet
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

    return [suggestionPlugin]
  },

  addCommands() {
    return {
      ...this.parent?.(),

      writeSerialDecs: (options = {}) => ({ editor, state }: { editor: any, state: any }) => {
        let suggState = suggestionKey.getState(state) as SuggestionState
        let decs = suggState.decHandler.serialize()
        return true
      }
    }
  }
})

export default Suggestion
