import { DecorationSet } from "@tiptap/pm/view";
import { Transaction } from "@tiptap/pm/state";
import { Node } from "prosemirror-model";
import { Decoration, DecorationAttrs, EditorView } from "prosemirror-view";
import { CorrectionResponse, SerialDecoration, SuggSpec } from "./suggestion.d";
import { debounceLag } from "../utils/debounce";
import { getDecs, postCorrections, postDecs, ltCheck } from "../api/journal_entries";
import { LTCheckResponse } from "../api/lt.d";

// TODO: integrate this into DecHandler
function ltToDecs(start: number, ltCheckResponse :LTCheckResponse): Decoration[] {
  let attrs: DecorationAttrs = { class: 'correction-dec' }
  let decs: Decoration[] = []
  for (var match of ltCheckResponse.matches) {
    let offset = match.offset+start
    let spec: SuggSpec = {
      correction: match.replacements[0].value,
      explanation: match.message,
      attrs
    }
    let d = Decoration.inline(offset, offset+match.length, attrs, spec)
    decs.push(d)
  }
  return decs
}

class DecHandler {
  decSet: DecorationSet;
  trBuf: Transaction[];
  entryId: number;
  state: Node
  view: EditorView
  private debouncedAddDecs: () => void;

  constructor(state: Node, view: EditorView, entryId: number) {
    this.decSet = DecorationSet.create(state, []);
    this.trBuf = [];
    this.entryId = entryId;
    this.state = state
    this.view = view
    // Bind the context and create debounced function once
    this.debouncedAddDecs = debounceLag(() => this.addDecs(), 500);
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
    // mapping must happen after deletions: deletions have weird boundaries, we need to know deletions before decs mapped
    this.handleDeletions(tr)
    // map forward/backward
    this.decSet = this.decSet.map(tr.mapping, tr.doc)
  }

  handleDeletions(tr: Transaction): void {
    // get range of mapping and delete decs
    tr.mapping.maps.forEach((stepMap) => {
      stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
        // true deletion occurs when old range is larger than new range
        const isDeletion = oldEnd - oldStart > newEnd - newStart
        if (isDeletion) {
          let deletedFrom = oldStart;
          // end of deletions = prevous start + (old range - new range) 
          let deletedTo = oldStart + ((oldEnd - oldStart) - (newEnd - newStart));
          // decs near deltion, but this includes deletedFrom-1 and deletedTo+1 - not what we want
          let inRangedecs = this.decSet.find(deletedFrom, deletedTo);
          if (inRangedecs.length > 0) {
            const deleteDecs: Decoration[] = []
            for (var dec of inRangedecs) {
              // if deletion is inbounds of dec, add to deletion array
              if (deletedFrom < dec.to && deletedTo > dec.from) {
                deleteDecs.push(dec) 
              }
            }
            this.decSet = this.decSet.remove(deleteDecs);
          }
        }
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
        nodes.push(new ParagraphNode(node, pos, parent, index));
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
    let decs: Decoration[] = []
    for (var node of nodes) {
      if (node.node.textContent === '') {
        continue
      }
      // start at i+1 bc paragraph start token
      this.getDecorations(node.pos+1, node.node.textContent, 'fr-FR')  
      //decs = decs.concat(newDecs)
    }
  }

  push(decs: Decoration[]) {
    // clear old decorations if there's overlap
    let deleteDecs: Decoration [] = []
    for (var dec of decs) {
      let oldDecs = this.decSet.find(dec.from, dec.to)
      // TODO: oldDecs can have null values so passing them as a list 
      deleteDecs = deleteDecs.concat(oldDecs)
    }
    this.decSet = this.decSet.remove(deleteDecs)
    // add to new/replacement decorations
    this.decSet = this.decSet.add(this.state, decs)
    // sync with editor and db
    this.syncDb()
    this.view.dispatch(this.view.state.tr.setMeta('refresh', true))
  }

  async getDecorations(start: number, text: string, language: string): Promise<Decoration[]> {
    let ltCheckResponse: LTCheckResponse | undefined
    try {
      //let res = await postCorrections(start, text)
      ltCheckResponse = await ltCheck({text: text, language: language})
      console.log(ltCheckResponse)
    } catch (err) {
      alert(err)
    }
    if (ltCheckResponse){
      let decs = ltToDecs(start, ltCheckResponse)
      console.log('decos', decs)
      this.push(decs)
    }
    return []
  }

  syncDb() {
    let decs = this.serialize()
    postDecs(this.entryId, decs)
  }

  async getDbDecs() {
    let serialDecs = await getDecs(this.entryId)
    let decs = this.deserialize(serialDecs)
    this.decSet = this.decSet.add(this.state, decs)
    this.view.dispatch(this.view.state.tr.setMeta('refresh', true))
  }

  serialize(): SerialDecoration[] {
    let serialDecs: SerialDecoration[] = []
    const decs = this.decSet.find()
    decs.forEach(dec => {
      serialDecs.push({from: dec.from, to: dec.to, spec: dec.spec})
    })
    return serialDecs
  } 

  deserialize(decs: SerialDecoration[]): Decoration[] {
    let decorations: Decoration[] = []
    for (var dec of decs) {
      let d = Decoration.inline(dec.from, dec.to, dec.spec.attrs, dec.spec)
      decorations.push(d)
    }
    return decorations
  }
}

// TODO make interface?
class ParagraphNode {
  node: Node
  pos: number
  parent: Node | null
  index: number

  constructor(node: Node, pos: number, parent: Node | null, index: number) {
    this.node = node
    this.pos = pos
    this.parent = parent
    this.index = index
  }
}

export default DecHandler
