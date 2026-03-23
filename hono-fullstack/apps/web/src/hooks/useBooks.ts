import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../client'
import type { InferRequestType } from 'hono/client'

type CreateInput = InferRequestType<typeof client.api.books.$post>['json']
type UpdateInput = InferRequestType<(typeof client.api.books)[':id']['$patch']>['json']

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await client.api.books.$get()
      if (!res.ok) throw new Error('Failed to fetch books')
      return res.json()
    },
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: async () => {
      const res = await client.api.books[':id'].$get({ param: { id } })
      if (!res.ok) throw new Error('Failed to fetch book')
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (json: CreateInput) => {
      const res = await client.api.books.$post({ json })
      if (!res.ok) throw new Error('Failed to create book')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...json }: UpdateInput & { id: string }) => {
      const res = await client.api.books[':id'].$patch({ param: { id }, json })
      if (!res.ok) throw new Error('Failed to update book')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.books[':id'].$delete({ param: { id } })
      if (!res.ok) throw new Error('Failed to delete book')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  })
}
