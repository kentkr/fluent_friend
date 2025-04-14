import { EntryObj } from '../../types/Journal'

export interface JournalListProps {
  entries: EntryObj[];
  setEntries: React.Dispatch<React.SetStateAction<EntryObj[]>>;
  setCurrEntry: React.Dispatch<React.SetStateAction<EntryObj | undefined>>;
  newEntry: CallableFunction;
}

export interface EntryProps {
  entry: EntryObj;
  deleteEntry: CallableFunction;
  selectEntry: CallableFunction;
}

