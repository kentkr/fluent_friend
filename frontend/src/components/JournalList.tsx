import '../styles/theme.css'
import { EntryObj } from '../pages/Journal'
import { SetStateAction, Dispatch } from 'react';

interface JournalListProps {
    entries: EntryObj[];
    newEntry: CallableFunction;
    deleteEntry: CallableFunction;
    selectEntry: CallableFunction;
}


function JournalList({ entries, newEntry, deleteEntry, selectEntry }: JournalListProps): JSX.Element {
    return ( 
        <>
            <div className="p-2 w-1/4 border boder-background bg-foreground flex flex-col">
                <h1>Journal entries</h1>
                <div className='border border-background p-2 flex-1'>
                    <ol>
                    {
                        entries.map((entry) => (
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
            <li className='flex justify-between m-1' id={entry.id.toString()}>
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
