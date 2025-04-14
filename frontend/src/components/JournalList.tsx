import '../styles/JournalList.css'
import { EntryObj } from '../pages/Journal'
import api from '../api';
import { SetStateAction, Dispatch } from 'react';

interface JournalListProps {
  entries: EntryObj[];
  setEntries: React.Dispatch<React.SetStateAction<EntryObj[]>>;
  setCurrEntry: React.Dispatch<React.SetStateAction<EntryObj | undefined>>;
  newEntry: CallableFunction;
}

function JournalList({ entries, setEntries, setCurrEntry, newEntry }: JournalListProps): JSX.Element {
  // delete entry 
  function deleteEntry({ id }: { id: number }) {
    api 
      .delete(`/api/journal_entries/delete/${id}/`, {})
      .then((res) => res.data)
      .then((data) => {
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))
      })
  }

  // grab en entry to set as curr
  function selectEntry({ entry }: { entry: EntryObj }) {
    setCurrEntry(entry)
  }

  return ( 
    <>
      <div className="p-2 w-1/4 border boder-background flex flex-col">
        <h1 className='list-title'>Journal entries</h1>
        <div className='border border-background p-2 flex-1'>
          <ol>
            {
              entries
                .sort((a, b) => a.id - b.id)
                .map((entry) => (
                <Entry key={entry.id} entry={entry} deleteEntry={deleteEntry} selectEntry={selectEntry}/>
              ))
            }
          </ol>
          <button onClick={() => newEntry()}>+</button>
        </div>
      </div>
    </>
  )
}

interface EntryProps {
  entry: EntryObj;
  deleteEntry: CallableFunction;
  selectEntry: CallableFunction;
}

function Entry({ entry, deleteEntry, selectEntry }: EntryProps): JSX.Element {
  return (
    <>
      <li className='entry-li' id={entry.id.toString()}>
        <p>{entry.title}</p>
        <div>
          <button onClick={() => selectEntry({ entry: entry })}>e</button>
          <button onClick={() => deleteEntry({ id: entry.id} )}>-</button>
        </div>
      </li>
    </>
  )
}

export default JournalList
