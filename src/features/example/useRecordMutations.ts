import { useMutation } from '@tanstack/react-query'
import { useToast } from '@arorms/ui'
import { toMessage, useT } from '@arorms/core'
import { createRecord, deleteRecord, updateRecord, type RecordInput } from './api'

/**
 * Write mutations for the example domain. Each success calls back so the list can reload, and raises
 * a toast — the same shape every arorms CRUD page should use.
 *
 * The list itself is read with `usePagedQuery` from `@arorms/core` (see `ExampleCrudPage`), because
 * the backend returns a Spring page envelope; mutations stay on TanStack Query.
 */
export function useRecordMutations(onChanged: () => void) {
  const { pushToast } = useToast()
  const t = useT()

  const onError = (err: unknown) => pushToast({ message: toMessage(err), tone: 'danger' })

  const create = useMutation({
    mutationFn: (input: RecordInput) => createRecord(input),
    onSuccess: () => {
      onChanged()
      pushToast({ message: t('example.created'), tone: 'success' })
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, input }: { id: number; input: RecordInput }) => updateRecord(id, input),
    onSuccess: () => {
      onChanged()
      pushToast({ message: t('example.updated'), tone: 'success' })
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteRecord(id),
    onSuccess: () => {
      onChanged()
      pushToast({ message: t('example.deleted'), tone: 'success' })
    },
    onError,
  })

  return { create, update, remove }
}
