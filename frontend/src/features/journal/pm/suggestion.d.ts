import { DecorationAttrs } from "prosemirror-view";
import { Match } from "../api/lt";

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
}

export interface EntryObj {
    id: number;
    user: number;
    title: string | null;
    text: string | null;
} 

export interface ToolTipInfo {
  open: boolean
  suggSpec: SuggSpec
}
