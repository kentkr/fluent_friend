import { EntryProps } from "../journal_list/JournalList.d"
import './Entry.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export function Entry({ entry, deleteEntry, selectEntry }: EntryProps): JSX.Element {
  return (
    <>
      <li className='entry-li' id={entry.id.toString()}>
        <p>{entry.title}</p>
        <div>
          <button 
            className="button"
            onClick={() => selectEntry({ entry: entry })}
          >
            <FaRegEdit />
          </button>
          <button 
            className="button"
            onClick={() => deleteEntry({ id: entry.id} )}
          >
            <MdDelete />
          </button>
        </div>
      </li>
    </>
  )
}

