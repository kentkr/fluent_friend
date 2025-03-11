import '../styles/theme.css'
import { EntryObj } from '../pages/Journal'

interface JournalListProps {
    entries: EntryObj[];
    newEntry: CallableFunction;
}

function onDelete() {
    console.log('delete');
}

function onEdit() {
    console.log('edit');
}

function JournalList({ entries, newEntry }: JournalListProps): JSX.Element {

    return ( 
        <>
            <div className="p-2 w-1/4 border boder-background bg-foreground flex flex-col">
                <h1>Journal entries</h1>
                <div className='border border-background p-2 flex-1'>
                    <ol>
                    {
                        entries.map((entry) => (
                            <Entry entry={entry} onDelete={onDelete} onEdit={onEdit} key={entry.id}/>
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
    onDelete: CallableFunction;
    onEdit: CallableFunction;
}

function Entry({ entry, onDelete, onEdit }: EntryProps): JSX.Element {
    return (
        <>
            <li className='flex justify-between m-1' id={entry.id.toString()}>
                <p>{entry.title}</p>
                <div>
                <button onClick={() => onEdit(entry.id)}>e</button>
                <button onClick={() => onDelete(entry.id)}>-</button>
                </div>
            </li>
        </>
    )
}

export default JournalList
