import {useEffect, useRef, useState} from "react";
import './Journal.css'
import { EntryObj } from "../../../features/journal/types/Journal";
import JournalList from "../../../features/journal/components/journal_list/JournalList";
import { Editor } from "../../../features/journal/components/editor/Editor";
import { Title } from "../../../features/journal/components/title/Title";
import { listJournalEntries, updateEntry } from "../../../features/journal/api/journal_entries";
import { newEntry as apiNewEntry } from "../../../features/journal/api/journal_entries";

function Journal() {
  const [entries, setEntries] = useState<EntryObj[]>([])
  const [currEntry, setCurrEntry] = useState<EntryObj | undefined>();
  // dont allow newEntry on mount to run twice
  const hasCreatedInitialEntry = useRef(false)

  // Fetch entries on mount only
  useEffect(() => {
    const fetchData = async () => { 
      const entries = await listJournalEntries() 
      setEntries(entries);
      // Set first entry as current if there are entries and no current entry selected
      if (entries.length > 0 && !currEntry) {
        setCurrEntry(entries[0]);
      }

      // create new entry if none exist
      if (entries.length === 0 && !currEntry && !hasCreatedInitialEntry.current){
        hasCreatedInitialEntry.current = true
        await newEntry()
      }
    }

    fetchData().catch(console.error)
  }, []); 


  function updateTitle({ title }: { entry_id: number, title: string }): void {
    if (!currEntry) return;
    setCurrEntry(prevCurrEntry => {
      if (!prevCurrEntry) return;
      return { ...prevCurrEntry, title: title }
    }) 

    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === currEntry.id ? { ...entry, title: title } : entry
      )
    );

    let updatedEntry = currEntry
    updatedEntry.title = title
    updateEntry(updatedEntry)
  }

  async function newEntry() {
    const entry = await apiNewEntry()
    setEntries(entries => [entry, ...entries]);
    setCurrEntry(entry);
  }

  // on first render skip
  if (!currEntry) {
    return <div>Loading...</div>;
  }

  return <>
    <div className="flex flex-1">
        <JournalList 
          entries={entries} 
          setEntries={setEntries} 
          currEntry={currEntry}
          setCurrEntry={setCurrEntry} 
          newEntry={newEntry} 
          />
        <div className="editor-container-0">
          <Title currEntry={currEntry} updateTitle={updateTitle}/>
          <Editor 
            currEntry={currEntry} 
            setCurrEntry={setCurrEntry} 
            setEntries={setEntries}
            />
      </div>
    </div>
  </>
}

export default Journal
