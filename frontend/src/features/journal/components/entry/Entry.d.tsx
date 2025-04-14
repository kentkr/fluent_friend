import { EntryObj } from "../../types/Journal";

export interface EntryProps {
  entry: EntryObj;
  deleteEntry: CallableFunction;
  selectEntry: CallableFunction;
}
