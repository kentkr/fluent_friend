import {useEffect, useState} from "react";
import api from '../api'
import '../styles/Journal1.css'
import { EntryObj } from "../pm/types";
import { TiptapEditor, Title } from '../components/Tiptap'
import JournalList from "../components/JournalList";

function Journal1() {
  const [entries, setEntries] = useState<EntryObj[]>([])
  const [currEntry, setCurrEntry] = useState<EntryObj | undefined>();

  function updateTitle({ title }: { entry_id: number, title: string }) {
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
    api
      .put(`/api/journal_entries/update/${currEntry.id}/`, updatedEntry)
      .catch((err) => alert(err));
  }

  // Fetch entries on mount only
  useEffect(() => {
    api
      .get("/api/journal_entries/")
      .then((res) => res.data)
      .then((entries) => {
        setEntries(entries);
        // Set first entry as current if there are entries and no current entry selected
        if (entries.length > 0 && !currEntry) {
          entries.sort((a: EntryObj, b: EntryObj) => a.id - b.id)
          setCurrEntry(entries[0]);
        } 

        // if no entries then create new one
        if (!entries && !currEntry){
          newEntry()
        }
      })
      .catch((err) => alert(err));
  }, []); 

  function newEntry() {
    api 
      .post("/api/journal_entries/", {})
      .then((res) => res.data)
      .then((data) => {
        setEntries(entries => [...entries, data]);
        setCurrEntry(data);
      })
    // TODO: make new entry have a default value
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
          setCurrEntry={setCurrEntry} 
          newEntry={newEntry} 
          />
        <div className="editor-container-0">
          <Title currEntry={currEntry} updateTitle={updateTitle}/>
          <hr></hr>
          <TiptapEditor 
            currEntry={currEntry} 
            setCurrEntry={setCurrEntry} 
            setEntries={setEntries}
            />
      </div>
    </div>
  </>
}

export default Journal1
