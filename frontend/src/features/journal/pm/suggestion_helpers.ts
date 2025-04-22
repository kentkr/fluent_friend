import { DecorationSet, EditorView } from "@tiptap/pm/view"

export function initTooltip(currTooltip: HTMLElement, view: EditorView): HTMLElement {
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

export function updateTooltip(
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
