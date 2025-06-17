import { DecorationSet, EditorView } from 'prosemirror-view'
import { Extension } from '@tiptap/core'
import { Plugin,  PluginKey } from 'prosemirror-state'
import DecHandler from './dechandler'
import { SuggDec, SuggestionOptions } from './suggestion.d'

// TODO: get a more robust way to make this part of the class state
let EditorViewVar: EditorView;

export const suggestionKey = new PluginKey('suggestion')

const Suggestion = Extension.create<SuggestionOptions>({
  name: 'suggestion',
  addOptions() {
    return {
      entryId: -1,
      updateTooltip: () => {},
      language: 'auto',
      nativeLanguage: null
    }
  },

  addProseMirrorPlugins() {
    const entryId = this.options.entryId
    const updateTooltip = this.options.updateTooltip
    const language = this.options.language
    const nativeLanguage = this.options.nativeLanguage

    const suggestionPlugin = new Plugin({
      key: suggestionKey,
      state: {
        init(_, { doc }) {
          return new DecHandler(doc, EditorViewVar, entryId, language, nativeLanguage)
        },

        apply(tr, decHandler, _, newState) {
          //window.decHandler = decHandler
          // if doc changed trigger updates to decs
          if (tr.docChanged) {
            decHandler.update(tr, EditorViewVar, newState.doc)
          }
          // listen for dispatches from onCreate
          let onCreate = tr.getMeta('onCreate')
          if (onCreate) {
            // TODO: handle editor view var better on startup
            decHandler.view = EditorViewVar
            decHandler.getDbDecs()
          }
          // listen for dispatches from decHandler
          let refresh = tr.getMeta('refresh')
          if (refresh) {
            return decHandler
          }
          return decHandler
        },
      },

      props: {
        decorations(state) {
          let decHandler = this.getState(state)
          return decHandler?.decSet
        },

        handleClickOn(view, pos, _, _1, event, _2) {
          // update tooltip if clicked
          const clickedElement = event.target as HTMLElement
          if (clickedElement && clickedElement.hasAttribute('is-correction')) {
            let decHandler = this.getState(view.state)
            let decorationSet = decHandler?.decSet
            if (decorationSet) {
              let dec = decorationSet.find(pos, pos)
              // only pass in first dec - there shouldnt be multiple anyways
              updateTooltip({ suggDec: dec[0], open: true })
            }
          } else {
            let placeHolder: SuggDec = {from: -1, to: -1, spec: {ltMatch: {}, attrs: {}, phrase: ''}}
            updateTooltip({ suggDec: placeHolder, open: false })
          }
        },
      },

      view: function(_) {
        return {
          update(view, _) {
            EditorViewVar = view;
          },
        }
      },

    })

    return [suggestionPlugin]
  },
})

export default Suggestion
