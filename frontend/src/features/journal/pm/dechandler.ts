import { DecorationSet } from "@tiptap/pm/view";
import { Transaction } from "@tiptap/pm/state";
import { Node } from "prosemirror-model";
import { Decoration, DecorationAttrs, EditorView } from "prosemirror-view";
import { SerialDecoration, SuggDec, SuggSpec, ParagraphNode} from "./suggestion.d";
import { debounceLag } from "../utils/debounce";
import { getDecs, postDecs, ltCheck } from "../api/journal_entries";
import { LTCheckResponse } from "../lt/lt.d";
import { languageMap } from "../lt/lt";
import { issueClassMap } from "./utils";
import { JOURNAL_DEBOUNCE_MS } from "../../../constants";

class DecHandler {
  decSet: DecorationSet;
  ignoreDecSet: DecorationSet;
  trBuf: Transaction[];
  entryId: number;
  state: Node
  view: EditorView
  language: string
  nativeLanguage: string | null
  private debouncedAddDecs: () => void;

  constructor(state: Node, view: EditorView, entryId: number, language: string, nativeLanguage: string | null) {
    this.decSet = DecorationSet.create(state, []);
    this.ignoreDecSet = DecorationSet.create(state, []);
    this.trBuf = [];
    this.entryId = entryId;
    this.state = state
    this.view = view
    this.language = language
    this.nativeLanguage = nativeLanguage
    // Bind the context and create debounced function once
    this.debouncedAddDecs = debounceLag(() => this.addDecs(), JOURNAL_DEBOUNCE_MS);
  }

  update(tr: Transaction, view: EditorView, state: Node): void {
    // map decset forward/backward
    this.view = view
    this.state = state
    this.mapDecs(tr)
    this.trBuf.push(tr);
    this.debouncedAddDecs();
  }

  mapDecs(tr: Transaction): void {
    // map forward/backward
    this.decSet = this.decSet.map(tr.mapping, tr.doc)
    this.ignoreDecSet = this.ignoreDecSet.map(tr.mapping, tr.doc)
    // delete decs if they were modified
    tr.mapping.maps.forEach((stepMap) => {
      stepMap.forEach((oldStart, oldEnd, _newStart, _newEnd) => {
        this.decSet = this.decSet.remove(this.decSet.find(oldStart, oldEnd));
      })
    })
  }

  getParagraphNodes(): ParagraphNode[] {
    if (this.trBuf.length === 0) return [];
    
    const lastTr = this.trBuf[this.trBuf.length - 1];
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    // get min/max changed for these steps
    this.trBuf.forEach(tr => {
      tr.mapping.maps.forEach((stepMap) => {
        stepMap.forEach((from, to) => {
          min = Math.min(min, from);
          max = Math.max(max, to);
          max = Math.min(max, lastTr.doc.nodeSize); // not greater than doc size
        });
      });
    });

    // get all paragraphs impacted by changes
    const nodes: ParagraphNode[] = [];
    max = Math.min(max, lastTr.doc.nodeSize-2)
    lastTr.doc.nodesBetween(min, max, (node, pos, parent, index) => {
      if (node.isBlock) {
        // TODO: make this a type
        nodes.push({node, pos, parent, index});
      } 
      return true;
    });

    this.trBuf = [];
    return nodes
  }
  
  async addDecs(): Promise<void> {
    // get impacted nodes
    const nodes = this.getParagraphNodes();
    // receive decorations from api
    for (var node of nodes) {
      if (node.node.textContent === '') {
        continue
      }
      // start at i+1 bc paragraph start token
      let start = node.pos+1
      let end = node.pos+1+node.node.textContent.length
      this.getDecorations(start, end, node.node.textContent)  
    }
  }

  push(decs: SuggDec[]): void {
    // clear old decorations if there's overlap
    let newDecs: SuggDec[] = []
    let deleteDecs: SuggDec[] = []
    for (var dec of decs) {
      let ignore = this.ignoreDecSet.find(dec.from, dec.to)[0]
      if (ignore && DecHandler.shouldIgnoreDec(dec, ignore)) {
        continue
      }
      newDecs = newDecs.concat(dec)
      let oldDecs = this.decSet.find(dec.from, dec.to)
      // TODO: oldDecs can have null values so passing them as a list 
      deleteDecs = deleteDecs.concat(oldDecs)
    }
    this.decSet = this.decSet.remove(deleteDecs)
    // add to new/replacement decorations
    this.decSet = this.decSet.add(this.state, newDecs)
    // sync with editor and db
    this.syncDb()
    this.view.dispatch(this.view.state.tr.setMeta('refresh', true))
  }

  ignoreDec(from?: number, to?: number): void {
    // used in the tooltip to ignore a decoration
    // we must acll this.decset.find twice - its output is mutable
    this.ignoreDecSet = this.ignoreDecSet.add(this.state, this.decSet.find(from, to))
    this.decSet = this.decSet.remove(this.decSet.find(from, to))
    this.syncDb()
    this.view.dispatch(this.view.state.tr.setMeta('refresh', ''))
  }

  async getDecorations(start: number, end: number, text: string): Promise<void> {
    let ltCheckResponse: LTCheckResponse | undefined
    try {
      // TODO dog wtf - handle the language state better fr
      let language = languageMap.get(this.language)
      let nativeLanguage = this.nativeLanguage !== null 
        ? languageMap.get(this.nativeLanguage) 
        : undefined
      if (language) {
        ltCheckResponse = await ltCheck({text: text, language: language, motherTongue: nativeLanguage})
      } else {
        ltCheckResponse = await ltCheck({text: text, language: 'auto', motherTongue: nativeLanguage})
      }
    } catch (err) {
      alert(err)
    }
    if (ltCheckResponse){
      let decs = DecHandler.ltToDecs(start, ltCheckResponse, text)
      // remove decs before pushing
      // TODO: does not follow single responsibility, should refactor
      this.decSet = this.decSet.remove(this.decSet.find(start, end))
      this.push(decs)
    }
  }

  syncDb() {
    let decs = DecHandler.serialize(this.decSet)
    let ignoreDecs = DecHandler.serialize(this.ignoreDecSet)
    postDecs(this.entryId, decs, ignoreDecs)
  }

  async getDbDecs() {
    let [serialDecs, serialIgnoreDecs] = await getDecs(this.entryId)
    let decs = DecHandler.deserialize(serialDecs)
    let ignoreDecs = DecHandler.deserialize(serialIgnoreDecs)
    this.decSet = this.decSet.add(this.state, decs)
    this.ignoreDecSet = this.ignoreDecSet.add(this.state, ignoreDecs)
    this.view.dispatch(this.view.state.tr.setMeta('refresh', true))
  }

  static serialize(decSet: DecorationSet): SerialDecoration[] {
    let serialDecs: SerialDecoration[] = []
    const decs = decSet.find()
    decs.forEach(dec => {
      serialDecs.push({from: dec.from, to: dec.to, spec: dec.spec})
    })
    return serialDecs
  } 

  static deserialize(decs: SerialDecoration[]): SuggDec[] {
    let decorations: SuggDec[] = []
    for (var dec of decs) {
      let d = Decoration.inline(dec.from, dec.to, dec.spec.attrs, dec.spec)
      decorations.push(d)
    }
    return decorations
  }

  static shouldIgnoreDec(newDec: SuggDec, ignoredDec: SuggDec): boolean {
    const fromMatch = newDec.from === ignoredDec.from
    const toMatch = newDec.to === ignoredDec.to
    // @ts-ignore - type exists
    const phraseMatch = newDec.type.spec.phrase
    return (fromMatch && toMatch && phraseMatch)
  }

  static ltToDecs(start: number, ltCheckResponse :LTCheckResponse, text: string): SuggDec[] {
    let decs: SuggDec[] = []
    for (var match of ltCheckResponse.matches) {
      let editorOffset = match.offset+start
      // @ts-ignore - extra objects like 'is-correction' are allowed
      let attrs: DecorationAttrs = { class: 'warning-dec', 'is-correction': true} 
      if (match.rule.issueType in issueClassMap) {
        attrs.class = issueClassMap[match.rule.issueType as keyof typeof issueClassMap];
      }
      let spec: SuggSpec = {
        ltMatch: match,
        attrs: attrs,
        phrase: text.substring(match.offset, match.offset+match.length)
      }
      let d = Decoration.inline(editorOffset, editorOffset+match.length, attrs, spec)
      decs.push(d)
    }
    return decs
  }
}

export default DecHandler
