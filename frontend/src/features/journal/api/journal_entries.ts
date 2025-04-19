
import api from '../../../api';
import { SerialDecoration } from '../pm/suggestion.d';
import { EntryObj } from '../types/Journal';

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
  console.count(`post decs ${entryId}`)
  console.log(decs)
  api
    .post(`/api/journal_entries/update/${entryId}/decs/`, decs)
    .catch((err) => alert(err))
}

export async function getDecs(entryId: number): Promise<SerialDecoration[]> {
  console.count(`get decs ${entryId}`)
  const response = await api.get(`/api/journal_entries/update/${entryId}/decs/`)
  return response.data.decorations
}

