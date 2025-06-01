import {useEffect, useState} from "react";
import api from '../../../api'
import './Journal.css'
import { EntryObj } from "../../../features/journal/types/Journal";
import JournalList from "../../../features/journal/components/journal_list/JournalList";
import { Editor } from "../../../features/journal/components/editor/Editor";
import { Title } from "../../../features/journal/components/title/Title";
import { updateEntry } from "../../../features/journal/api/journal_entries";

function Journal() {
  const [entries, setEntries] = useState<EntryObj[]>([])
  const [currEntry, setCurrEntry] = useState<EntryObj | undefined>();

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

  // TODO put api calls in api file
  // Fetch entries on mount only
  useEffect(() => {
    api
      .get("/api/journal_entries/")
      .then((res) => res.data)
      .then((entries) => {
        // TODO - fix when doing api stuff
        for (var entry of entries) {
          entry.nativeLanguage = entry.native_language
        }
        setEntries(entries);
        // Set first entry as current if there are entries and no current entry selected
        if (entries.length > 0 && !currEntry) {
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
        console.log(data)
        setEntries(entries => [...entries, data]);
        setCurrEntry(data);
      })
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
