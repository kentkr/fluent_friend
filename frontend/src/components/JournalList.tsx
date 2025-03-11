import '../styles/theme.css'

interface JournalListProps {
    entries: Array<Entry>;
}

function onDelete() {
    console.log('delete');
}

function onEdit() {
    console.log('edit');
}

function JournalList({ entries }: JournalListProps): JSX.Element {
    return ( 
        <>
            <div className="p-2 w-1/4 border boder-background bg-foreground flex flex-col">
                <h1>Journal entries</h1>
                <div className='border border-background p-2 flex-1'>
                    <ol>
                    {
                        entries.map((entry) => (
                            <Tmp entry={entry} onDelete={onDelete} onEdit={onEdit} key={entry.id}/>
                        ))
                    }
                    </ol>
                    <button>+</button>
                </div>
            </div>
        </>
    )
}

interface Entry {
    id: number;
    user: number;
    title: string;
    text: string
} 

interface TmpProps {
    entry: Entry;
    onDelete: CallableFunction;
    onEdit: CallableFunction;
}

function Tmp({ entry, onDelete, onEdit }: TmpProps): JSX.Element {
    return (
        <>
            <li className='flex justify-between m-1' id={entry.id.toString()}>
                <p>{entry.title}</p>
                <div>
                <button onClick={() => onDelete(entry.id)}>e</button>
                <button onClick={() => onEdit(entry.id)}>-</button>
                </div>
            </li>
        </>
    )
}

export default JournalList
