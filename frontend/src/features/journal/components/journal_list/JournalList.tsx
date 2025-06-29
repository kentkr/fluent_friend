
import { deleteEntry as apiDeleteEntry } from '../../api/journal_entries';
import { EntryObj } from '../../types/Journal'
import { JournalListProps } from './JournalList.d';
import { Entry } from '../entry/Entry';
import { FaSquarePlus } from "react-icons/fa6";
import './JournalList.css'
import React, {useState} from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { HiX } from "react-icons/hi"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

function JournalList({ entries, setEntries, currEntry, setCurrEntry, newEntry }: JournalListProps): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

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
        <div className='bg-background p-2 flex-1 relative'>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='absolute right-0 top-0'>
            {mobileMenuOpen ? 
              <IoIosArrowBack className='text-green text-xl'/> :
              <IoIosArrowForward className='text-green text-xl'/> 
            }
          </button>
          <div className={mobileMenuOpen ? 'bg-foreground flex-1' : 'hidden'}>
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
        </div>
        {/*
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
        */}
      </div>
    </>
  )
}

export default JournalList
