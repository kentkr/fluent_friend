import { DecorationAttrs } from "prosemirror-view";
import { Match } from "../api/lt";
import { Decoration } from "prosemirror-view";
import { Node } from "prosemirror-model";


export interface SuggestionOptions {
  entryId: number
  updateTooltip: (props: UpdateTooltipProps) => void
  language: string
  nativeLanguage: string | null
}

export interface CorrectionResponse {
  changes_made: boolean;
  changes: any[];
}

export interface SerialDecoration {
  from: number,
  to: number,
  spec: SuggSpec
}

interface SuggSpec {
  ltMatch: Match
  // store attrs for later use
  attrs: DecorationAttrs
  // utilized for ignoring
  phrase: string
}

export interface EntryObj {
    id: number;
    user: number;
    title: string | null;
    text: string | null;
} 

export interface ToolTipInfo {
  open: boolean
  suggDec: SuggDec
}

export interface UpdateTooltipProps {
  suggDec: SuggDec
  open: boolean
}

export interface SuggDec extends Decoration {
  spec: SuggSpec
}

export interface ParagraphNode {
  node: Node
  pos: number
  parent: Node | null
  index: number
}
