import { EntryObj } from '../../types/Journal'

export interface JournalListProps {
  entries: EntryObj[];
  setEntries: React.Dispatch<React.SetStateAction<EntryObj[]>>;
  currEntry: EntryObj | undefined;
  setCurrEntry: React.Dispatch<React.SetStateAction<EntryObj | undefined>>;
  newEntry: CallableFunction;
}

