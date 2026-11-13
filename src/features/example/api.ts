/**
 * A tiny in-memory record store used by the sample CRUD page.
 *
 * The playground ships without a backend so it can be pasted anywhere and immediately demonstrate the
 * UX contract. Swap this module for real `apiClient` calls (see the commented block) when you build
 * a real project — the page code does not change shape.
 */
export type RecordStatus = 'ACTIVE' | 'PENDING' | 'ARCHIVED'

export interface RecordItem {
  id: number
  name: string
  description: string
  /** Optional so the sample also demonstrates missing-value rendering. */
  owner?: string
  status: RecordStatus
  tags: string[]
  createdAt: string
}

export type RecordInput = Pick<RecordItem, 'name' | 'description' | 'owner' | 'status' | 'tags'>

let records: RecordItem[] = [
  {
    id: 1,
    name: 'Invoice archive',
    description: 'Cold storage for filed invoices.',
    owner: 'demo.operator@arorms.cn',
    status: 'ACTIVE',
    tags: ['finance', 'archive'],
    createdAt: '2026-09-02T08:10:00Z',
  },
  {
    id: 2,
    name: 'Vendor registry',
    description: 'Approved suppliers and contacts.',
    status: 'PENDING',
    tags: ['procurement'],
    createdAt: '2026-09-18T13:45:00Z',
  },
  {
    id: 3,
    name: 'Access review Q4',
    description: 'Quarterly permission audit.',
    owner: 'security@arorms.cn',
    status: 'ACTIVE',
    tags: ['security', 'quarterly'],
    createdAt: '2026-10-06T09:30:00Z',
  },
]

let nextId = 4
const LATENCY = 220

const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => window.setTimeout(() => resolve(value), LATENCY))

export async function listRecords(params: {
  q?: string
  status?: RecordStatus | ''
  page: number
  size: number
}): Promise<{ content: RecordItem[]; total: number; last: boolean }> {
  const needle = params.q?.trim().toLowerCase()
  const matched = records.filter((item) => {
    if (params.status && item.status !== params.status) return false
    if (!needle) return true
    return (
      item.name.toLowerCase().includes(needle) ||
      item.description.toLowerCase().includes(needle) ||
      item.tags.some((tag) => tag.toLowerCase().includes(needle))
    )
  })
  const start = params.page * params.size
  const content = matched.slice(start, start + params.size)
  return delay({
    content,
    total: matched.length,
    last: start + content.length >= matched.length,
  })
}

export async function getRecord(id: number): Promise<RecordItem | null> {
  return delay(records.find((item) => item.id === id) ?? null)
}

export async function createRecord(input: RecordInput): Promise<RecordItem> {
  const created: RecordItem = {
    id: nextId++,
    name: input.name,
    description: input.description,
    owner: input.owner,
    status: input.status,
    tags: input.tags,
    createdAt: new Date().toISOString(),
  }
  records = [created, ...records]
  return delay(created)
}

export async function updateRecord(id: number, input: RecordInput): Promise<RecordItem> {
  const updated = records.find((item) => item.id === id)
  if (!updated) throw new Error(`Record ${id} not found`)
  updated.name = input.name
  updated.description = input.description
  updated.owner = input.owner
  updated.status = input.status
  updated.tags = input.tags
  return delay({ ...updated })
}

export async function deleteRecord(id: number): Promise<void> {
  records = records.filter((item) => item.id !== id)
  return delay(undefined)
}

/* Real backend version — delete the mock above and use this:

import { apiClient } from '@arorms/core'

export async function listRecords(params: { q?: string; page: number; size: number }) {
  const { data } = await apiClient.get('/records', { params })
  return data
}
export async function getRecord(id: number) {
  const { data } = await apiClient.get(`/records/${id}`)
  return data
}
export async function createRecord(input: RecordInput) {
  const { data } = await apiClient.post('/records', input)
  return data
}
export async function updateRecord(id: number, input: RecordInput) {
  const { data } = await apiClient.put(`/records/${id}`, input)
  return data
}
export async function deleteRecord(id: number) {
  await apiClient.delete(`/records/${id}`)
}
*/
