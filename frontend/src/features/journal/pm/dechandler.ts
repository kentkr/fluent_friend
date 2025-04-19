import { DecorationSet } from "@tiptap/pm/view";
import { EditorState, Transaction } from "@tiptap/pm/state";
import { Node } from "prosemirror-model";
import { Decoration, DecorationAttrs, EditorView } from "prosemirror-view";
import { CorrectionResponse, SerialDecoration } from "./suggestion.d";
import { debounceLag } from "../utils/debounce";
import { getDecs, postCorrections, postDecs } from "../api/journal_entries";


async function getDecorations(start: number, text: string): Promise<Decoration[]> {
  let corrections: CorrectionResponse    
  try {
    let res = await postCorrections(start, text)
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
  state: Node
  editorView: EditorView
  private debouncedAddDecs: () => void;

  constructor(decSet: DecorationSet, state: Node, editorView: EditorView) {
    this.decSet = decSet;
    this.trBuf = [];
    this.entryId = null;
    this.state = state
    this.editorView = editorView
    
    // Bind the context and create debounced function once
    this.debouncedAddDecs = debounceLag(() => this.addDecs(), 500);
  }

  tmp() {
    this.editorView.dispatch(this.editorView.state.tr.setMeta('refresh', true))
  }

  update(tr: Transaction, view: EditorView): void {
    // map decset forward/backward
    this.editorView = view
    this.decSet = this.decSet.map(tr.mapping, tr.doc)
    this.handleDeletions(tr)
    this.trBuf.push(tr);
    this.debouncedAddDecs();
  }

  handleDeletions(tr: Transaction): void {
    tr.mapping.maps.forEach((stepMap) => {
      stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => {
        console.log('Mapping:', oldStart, oldEnd, 'to', newStart, newEnd);
        // True deletion occurs when old range is larger than new range
        if (oldEnd - oldStart > newEnd - newStart) {
          // Calculate the deleted region more precisely
          let deletedFrom = oldStart;
          let deletedTo = oldStart + ((oldEnd - oldStart) - (newEnd - newStart));

          console.log(deletedFrom, deletedTo)
          let decs = this.decSet.find(deletedFrom, deletedTo);
          if (decs.length > 0) {
            console.log('Removing decorations:', decs);
            this.decSet = this.decSet.remove(decs);
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
        nodes.push(new ParagraphNode(node, pos, parent, index));
      } 
      return true;
    });

    // TODO: this shouldnt handle tr buf
    this.trBuf = [];
    return nodes;
  }
  
  async addDecs(): Promise<void> {
    // get impacted nodes
    const nodes = this.getParagraphNodes();
    // receive decorations
    let decs: Decoration[] = []
    for (var node of nodes) {
      let newDecs = await getDecorations(node.pos, node.node.textContent)  
      decs = decs.concat(newDecs)
    }
    // clear old decorations if there's overlap

    for (var dec of decs) {
      let oldDecs = this.decSet.find(dec.from, dec.to)
      // TODO: oldDecs can have null values so passing them as a list 
      // creates erroneous deletions
      if (oldDecs.length > 0) {
        for (var d of oldDecs) {
          console.log('deleting', d)
          this.decSet = this.decSet.remove([d])
        }
      }
    }
    // add to decset
    this.decSet = this.decSet.add(this.state, decs)
    // sync with editor and db
    this.syncDb()
    this.editorView.dispatch(this.editorView.state.tr.setMeta('refresh', true))
  }

  syncDb() {
    if (!this.entryId) {
      return
    }
    let decs = this.serialize()
    postDecs(this.entryId, decs)
  }

  async resetDecs(entryId: number) {
    // post current decs
    if (this.entryId) {
      let decs = this.serialize()
      postDecs(this.entryId, decs)
    }
    this.trBuf = [];
    this.decSet = DecorationSet.empty
    // get decs for new entryid
    this.entryId = entryId;
    let decs = await getDecs(this.entryId)
    if (decs) {
      let d = this.deserialize(decs)
      this.editorView.dispatch(this.editorView.state.tr.setMeta('asyncDecorations', d))
    } else {
      //this.addDecs()
    }
  }

  serialize(): SerialDecoration[] {
    let serialDecs: SerialDecoration[] = []
    const decs = this.decSet.find(0, this.editorView.state.doc.content.size)
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
