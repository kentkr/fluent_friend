
import api from '../../../../api';
import { EntryObj } from '../../types/Journal'
import { JournalListProps } from './JournalList.d';
import { Entry } from '../entry/Entry';
import { FaSquarePlus } from "react-icons/fa6";
import './JournalList.css'
import React from 'react';

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

  for (var e of entries) {
    console.log(e.id)
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
              <p>New entry</p>
              <FaSquarePlus />
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export default JournalList
