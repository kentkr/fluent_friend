import { DecorationSet } from "@tiptap/pm/view";
import { EditorState, Transaction } from "@tiptap/pm/state";
import { Node } from "prosemirror-model";
import { Decoration, DecorationAttrs, EditorView } from "prosemirror-view";
import { CorrectionResponse, SerialDecoration } from "./types";
import api from "../api";

function debounceLag<F extends (...args: any[]) => any>(
  fn: F,
  ms: number = 500
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<F>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn.apply(null, args)
      timeoutId = null;
    }, ms)
  }
}

async function getDecorations(start: number, text: string): Promise<Decoration[]> {
  let corrections: CorrectionResponse    
  try {
    let res = await api.post("/api/get_corrections/", {start: start, text: text})
    corrections = res.data
  } catch (err) {
    alert(err)
    corrections = { changes_made: false , changes: []}
  }

  let decos: Decoration[] = []

  if (corrections.changes) {
    for (var correction of corrections.changes) {
      let attrs: DecorationAttrs = { class: 'correction-dec' }
      let d = Decoration.inline(
        correction[0], 
        correction[1], 
        attrs,
        { correction: correction[2], attrs: { class: 'correction-dec' } }

      )
      // TODO this may not be necessary any more
      if (d) {
        decos.push(d)
      }
    }
  }
  return decos
}

class DecHandler {
  decSet: DecorationSet;
  trBuf: Transaction[];
  entryId: number | null;
  editorView: EditorView
  private debouncedAddDecs: () => void;

  constructor(decSet: DecorationSet, editorView: EditorView) {
    this.decSet = decSet;
    this.trBuf = [];
    this.entryId = null;
    this.editorView = editorView
    
    // Bind the context and create debounced function once
    this.debouncedAddDecs = debounceLag(() => this.addDecs(), 500);
  }

  update(tr: Transaction): void {
    this.trBuf.push(tr);
    this.debouncedAddDecs();
  }

  getParagraphNodes(): ParagraphNode[] {
    if (this.trBuf.length === 0) return [];
    
    const lastTr = this.trBuf[this.trBuf.length - 1];
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    this.trBuf.forEach(tr => {
      tr.mapping.maps.forEach((stepMap) => {
        stepMap.forEach((from, to) => {
          min = Math.min(min, from);
          max = Math.max(max, to);
          max = Math.min(max, lastTr.doc.nodeSize); // not greater than doc size
        });
      });
    });

    const nodes: ParagraphNode[] = [];
    max = Math.min(max, lastTr.doc.nodeSize-2)
    lastTr.doc.nodesBetween(min, max, (node, pos, parent, index) => {
      if (node.isBlock) {
        nodes.push(new ParagraphNode(node, pos, parent, index));
      } 
      return true;
    });

    this.trBuf = [];
    return nodes;
  }
  
  async addDecs(): Promise<void> {
    const nodes = this.getParagraphNodes();
    let decs: Decoration[] = []
    for (var node of nodes) {
      let newDecs = await getDecorations(node.pos, node.node.textContent)  
      decs = decs.concat(newDecs)
    }
    this.editorView.dispatch(this.editorView.state.tr.setMeta('asyncDecorations', decs))
  }

  syncDb() {
    let decs = this.serialize()
    api
      .post(`/api/journal_entries/update/${this.entryId}/decs/`, decs)
      .catch((err) => alert(err))
  }

  resetDecs(entryId: number) {
    // post current decs
    let decs = this.serialize()
    api
      .post(`/api/journal_entries/update/${this.entryId}/decs/`, decs)
      .catch((err) => alert(err))
    this.trBuf = [];
    this.decSet = DecorationSet.empty
    // get decs for new entryid
    this.entryId = entryId;
    api
      .get(`/api/journal_entries/update/${this.entryId}/decs/`)
      .then((res) => res.data)
      .then((data) => {
        let decs = this.deserialize(data.decorations)
      })
      .catch((err) => alert(err))
  }

  serialize(): SerialDecoration[] {
    let serialDecs: SerialDecoration[] = []
    const decs = this.decSet.find(0, this.editorView.state.doc.content.size)
    decs.forEach(dec => {
      serialDecs.push({from: dec.from, to: dec.to, spec: dec.spec})
    })
    return serialDecs
  } 

  deserialize(decs: SerialDecoration[]): DecorationSet {
    let decorations: Decoration[] = []
    for (var dec of decs) {
      let d = Decoration.inline(dec.from, dec.to, dec.spec.attrs, dec.spec)
      decorations.push(d)
    }
    this.decSet = DecorationSet.empty
    this.decSet = this.decSet.add(this.editorView.state.doc, decorations)
    return this.decSet
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
