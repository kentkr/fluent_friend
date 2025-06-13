import {useEffect, useState} from "react";
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

  // Fetch entries on mount only
  useEffect(() => {
    const fetchData = async () => { 
      const entries = await listJournalEntries() 
      setEntries(entries);
      // Set first entry as current if there are entries and no current entry selected
      if (entries.length > 0 && !currEntry) {
        setCurrEntry(entries[0]);
      } 

      // if no entries then create new one
      if (!entries && !currEntry){
        newEntry()
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
    setEntries(entries => [...entries, entry]);
    setCurrEntry(entry);
  }

  // on first render skip
  if (!currEntry) {
    return <div>Loading...</div>;
  }

  const titlePlaceholder = 'Log 0, still no pussy...'

  return <>
    <div className="flex flex-1">
        <JournalList 
          entries={entries} 
          setEntries={setEntries} 
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
