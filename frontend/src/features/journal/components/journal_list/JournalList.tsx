
import api from '../../../../api';
import './JournalList.css'
import { EntryObj } from '../../types/Journal'
import { JournalListProps } from './JournalList.d';
import { Entry } from '../entry/Entry';
import './JournalList.css'

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

export default JournalList
