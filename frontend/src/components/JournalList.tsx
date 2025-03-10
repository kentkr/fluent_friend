import '../styles/theme.css'

function JournalList(): JSX.Element {
    return ( 
        <>
            <div className="p-2 w-1/4 border boder-background bg-foreground flex flex-col">
                <h1>Journal entries</h1>
                <div className='border border-background p-2 flex-1'>
                    <ol>
                        <li className='flex justify-between m-1'>
                            <p>
                                first
                            </p>
                            <button>e</button>
                        </li>
                        <hr/>
                        <li className='flex justify-between m-1'>
                            <p>
                                second
                            </p>
                            <button>e</button>
                        </li>
                    </ol>
                    <button>+</button>
                </div>
            </div>
        </>
    )
}


export default JournalList
