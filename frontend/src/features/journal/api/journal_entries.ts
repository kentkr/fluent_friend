import { AxiosResponse } from 'axios';
import api from '../../../api/api-client';
import lt from './lt'
import { SerialDecoration } from '../pm/suggestion.d';
import { EntryObj } from '../types/Journal';
import { LTCheckParams, LTCheckResponse } from '../lt/lt.d'
import {javaToPepCase} from '../../../utils/case_conversion';

// TODO: handle errors
export function updateEntry(entry: Partial<EntryObj>): void {
  let pepFriendlyObj: Record<string, any> = {}
  Object.entries(entry).forEach(([key, value]) => {
    pepFriendlyObj[javaToPepCase(key)] = value
  })
  // TODO its not clear that entry.id is required here
  api
    .put(`/api/journal_entries/update/${entry.id}/`, pepFriendlyObj)
    .catch((err) => alert(err));
}

// This is a seprate function than updateEntry bc decs should not be part of EntryObj
// it should only be managed by DecHandler
export function postDecs(entryId: number, decs: SerialDecoration[], ignoreDecs: SerialDecoration[]): void {
  api
    .post(`/api/journal_entries/update/${entryId}/`, {decorations: decs, ignore_decorations: ignoreDecs})
    .catch((err) => alert(err))
}

export async function getDecs(entryId: number): Promise<[SerialDecoration[], SerialDecoration[]]> {
  const response = await api.get(`/api/journal_entries/update/${entryId}/`, {
    params: {
      fields: ['decorations', 'ignore_decorations']
    }
  })
  return [response.data.decorations, response.data.ignore_decorations]
}

export async function ltCheck(query: LTCheckParams): Promise<LTCheckResponse> {
  const res = await lt.post<LTCheckParams, AxiosResponse<LTCheckResponse>>('/v2/check', query) 
  return res.data 
}

export async function listJournalEntries(): Promise<EntryObj[]> {
  let entries = await api
    .get("/api/journal_entries/")
    .then((res) => res.data)
    .then((entries) => {
      // set the backend naming convention to be frontend - this could be more efficient but doesnt matter
      for (var entry of entries) {
        entry.nativeLanguage = entry.native_language
      }
      return entries
    })
    .catch((err) => alert(err));
  return entries
}

export async function deleteEntry(id: number): Promise<void> {
  api 
    .delete(`/api/journal_entries/delete/${id}/`, {})
    .catch((err) => alert(err))
}

export async function newEntry(): Promise<EntryObj> {
  let entry = await api 
    .post("/api/journal_entries/", {})
    .then((res) => { return res.data })
    .catch((err) => alert(err))
  return entry
}
