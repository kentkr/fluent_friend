import { AxiosResponse } from 'axios';
import api from '../../../api';
import lt from './lt'
import { SerialDecoration } from '../pm/suggestion.d';
import { EntryObj } from '../types/Journal';
import { LTCheckParams, LTCheckResponse } from '../lt/lt.d'

// TODO: handle errors
export function putEntry(entry: EntryObj): void {
  api
    .put(`/api/journal_entries/update/${entry.id}/`, entry)
    .catch((err) => alert(err));
  console.count(`updating entry ${entry.id}`)
}

export async function postCorrections(start: number, text: string): Promise<any> {
  console.count('post corrections')
  return api.post("/api/get_corrections/", {'start': start, 'text': text})
}

export function postDecs(entryId: number, decs: SerialDecoration[]): void {
  console.log(`post decs ${entryId}`, decs)
  api
    .post(`/api/journal_entries/update/${entryId}/decs/`, decs)
    .catch((err) => alert(err))
}

export async function getDecs(entryId: number): Promise<SerialDecoration[]> {
  const response = await api.get(`/api/journal_entries/update/${entryId}/decs/`)
  console.log(`get decs ${entryId}`, response.data.decorations)
  return response.data.decorations
}

export async function ltCheck(query: LTCheckParams): Promise<LTCheckResponse> {
  const res = await lt.post<LTCheckParams, AxiosResponse<LTCheckResponse>>('/v2/check', query) 
  return res.data 
}

