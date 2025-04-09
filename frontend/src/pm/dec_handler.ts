import { DecorationSet } from "@tiptap/pm/view";
import { Transaction } from "@tiptap/pm/state";
import { Node } from "prosemirror-model";
import { Decoration, EditorView } from "prosemirror-view";
import { CorrectionResponse } from "./types";
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

  console.log(corrections)
  if (corrections.changes) {
    for (var correction of corrections.changes) {
      let d = Decoration.inline(
        correction[0], 
        correction[1], 
        { class: 'correction-dec' },
        { correction: correction[2] }

      )
      // TODO this may not be necessary any more
      if (d) {
        decos.push(d)
      }
    }
  }
  console.log('first decs: ' ,decos)
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
    console.log('Buffered transactions:', this.trBuf.length);
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

    console.log('Flushing transaction buffer');
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
    //this.decSet.add(this.editorView.state.doc, newDecs)
    console.log('dispatching decs: ', decs)
    this.editorView.dispatch(this.editorView.state.tr.setMeta('asyncDecorations', decs))
  }

  resetDecs(entryId: number) {
    this.trBuf = [];
    this.entryId = entryId;
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
