import { AxiosResponse } from 'axios';
import api from '../../../api';
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
export function postDecs(entryId: number, decs: SerialDecoration[]): void {
  console.log(`post decs ${entryId}`, decs)
  api
    .post(`/api/journal_entries/update/${entryId}/`, {decorations: decs})
    .catch((err) => alert(err))
}

export async function getDecs(entryId: number): Promise<SerialDecoration[]> {
  const response = await api.get(`/api/journal_entries/update/${entryId}/`, {
    params: {
      fields: ['decorations']
    }
  })
  console.log(`get decs ${entryId}`, response.data.decorations)
  return response.data.decorations
}

export async function ltCheck(query: LTCheckParams): Promise<LTCheckResponse> {
  const res = await lt.post<LTCheckParams, AxiosResponse<LTCheckResponse>>('/v2/check', query) 
  return res.data 
}

