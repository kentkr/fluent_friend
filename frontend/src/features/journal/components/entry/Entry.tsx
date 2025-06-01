import { EntryProps } from "../journal_list/JournalList.d"
import './Entry.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "@mui/material";

export function Entry({ entry, deleteEntry, selectEntry }: EntryProps): JSX.Element {
  return (
    <>
      <li className='entry-li' id={entry.id.toString()}>
        <Tooltip title={entry.title} placement="top">
          <p className="entry-title">{entry.title}</p>
        </Tooltip>
        <div className="button-div">
          <button 
            className="edit-button"
            onClick={() => selectEntry({ entry: entry })}
          >
            <FaRegEdit />
          </button>
          <button 
            className="delete-button"
            onClick={() => deleteEntry({ id: entry.id} )}
          >
            <MdDelete />
          </button>
        </div>
      </li>
    </>
  )
}

