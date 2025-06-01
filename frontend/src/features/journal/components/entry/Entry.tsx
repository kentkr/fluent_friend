import { EntryProps } from "./Entry.d"
import './Entry.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "@mui/material";
import { JOURNAL_TITLE_PLACEHOLDER } from "../../../../constants";

export function Entry({ entry, deleteEntry, selectEntry }: EntryProps): JSX.Element {
  const titleOrPlaceholder = entry.title === '' ? JOURNAL_TITLE_PLACEHOLDER : entry.title
  return (
    <>
      <li className='entry-li' id={entry.id.toString()}>
        <Tooltip title={titleOrPlaceholder} placement="top">
          <p className={entry.title === '' ? 'entry-title use-placeholder' : 'entry-title'}>{titleOrPlaceholder}</p>
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

