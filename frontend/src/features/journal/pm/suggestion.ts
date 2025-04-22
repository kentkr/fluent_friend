import { DecorationSet, EditorView } from 'prosemirror-view'
import { Extension } from '@tiptap/core'
import { Plugin,  PluginKey } from 'prosemirror-state'
import DecHandler from './dechandler'

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

const suggestionKey = new PluginKey('suggestion')

const Suggestion = Extension.create({
  name: 'suggestion',

  addProseMirrorPlugins() {
    const suggestionPlugin = new Plugin({
      key: suggestionKey,
      state: {
        init(_, { doc }) {
          let decorationSet = DecorationSet.create(doc, [])
          return new DecHandler(decorationSet, doc, EditorViewVar)
        },

        apply(tr, decHandler, oldState, newState) {
          // placeholder logic
          if (tr.docChanged) {
            decHandler.update(tr, EditorViewVar)
          }

          let refresh = tr.getMeta('refresh')
          if (refresh) {
            console.log('_ref in apply', decHandler.decSet.find())
            debugger
            return decHandler
          }

          // TODO remove this section
          let newEntryId = tr.getMeta('newEntryId')
          if (newEntryId && newEntryId != decHandler.entryId) {
            //decHandler.decSet = decHandler.decSet.remove(decHandler.decSet.find())
            decHandler.resetDecs(newEntryId)
            return decHandler
          }

          const asyncDecs = tr.getMeta('asyncDecorations')
          if (asyncDecs && asyncDecs.length > 0) {
            // TODO 
            decHandler.decSet = decHandler.decSet.add(tr.doc, asyncDecs)
            decHandler.syncDb()
            return decHandler
          }
          // mapping is requried
          return decHandler
        },
      },

      props: {
        decorations(state) {
          let decHandler = this.getState(state)
          if (decHandler !== undefined) {
            let d = decHandler.decSet
            return d
          }
        },

        handleClickOn(view, pos, node, nodePos, event, direct) {
          const clickedElement = event.target as HTMLElement
          if (clickedElement && clickedElement.className.includes('correction-dec')) {
            let currTooltip = document.querySelector('#correction-div') as HTMLElement
            if (!currTooltip) {
              currTooltip = initTooltip(currTooltip, view)
            }

            let decHandler = this.getState(view.state)
            let decorationSet = decHandler?.decSet
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

  //addCommands() {
  //  return {
  //    ...this.parent?.(),

  //    writeSerialDecs: (options = {}) => ({ editor, state }: { editor: any, state: any }) => {
  //      let suggState = suggestionKey.getState(state) as SuggestionState
  //      let decs = suggState.decHandler.serialize()
  //      return true
  //    }
  //  }
  //}
})

export default Suggestion
