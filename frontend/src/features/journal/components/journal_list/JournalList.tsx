
import { deleteEntry as apiDeleteEntry } from '../../api/journal_entries';
import { EntryObj } from '../../types/Journal'
import { JournalListProps } from './JournalList.d';
import { Entry } from '../entry/Entry';
import { FaSquarePlus } from "react-icons/fa6";
import './JournalList.css'
import React from 'react';

function JournalList({ entries, setEntries, currEntry, setCurrEntry, newEntry }: JournalListProps): JSX.Element {
  // delete entry 
  function deleteEntry({ id }: { id: number }) {
    apiDeleteEntry(id)
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id))
    if (currEntry && id !== currEntry.id) {
      // if deleted entry is not curr, do nothing
      return
    } else if (entries.length > 1){
      // if list not empty, set last entry as curr
      // in this case entries empty is > 1 bc entries hasn't updated yet
      entries.map((entry) => {
        if (entry.id !== id) {
          setCurrEntry(entry)
          return
        }
      })
    } else {
      newEntry()
    }
  }

  // grab en entry to set as curr
  function selectEntry({ entry }: { entry: EntryObj }) {
    setCurrEntry(entry)
  }

  return ( 
    <>
      <div className="component-container">
        <p className='list-title'>Entries</p>
        <div className='list-container'>
          <ol>
            {
              entries
                .map((entry, index, arr) => (
                  <React.Fragment key={entry.id}>
                    <Entry entry={entry} deleteEntry={deleteEntry} selectEntry={selectEntry}/>
                    {index < arr.length - 1 && <hr className='list-separator' />} 
                  </React.Fragment> 
              ))
            }
          </ol>
          <button 
            className='new-button'
            onClick={() => newEntry()}
          >
            <span className='new-button-span'>
              <p className='px-1'>New entry</p>
              <FaSquarePlus />
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export default JournalList
