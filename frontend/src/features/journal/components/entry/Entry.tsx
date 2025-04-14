import { EntryProps } from "../journal_list/JournalList.d"
import './Entry.css'

export function Entry({ entry, deleteEntry, selectEntry }: EntryProps): JSX.Element {
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

