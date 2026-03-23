import { z } from '@hono/zod-openapi'

export const BookSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    title: z.string().min(1).max(200).openapi({ example: 'The Pragmatic Programmer' }),
    author: z.string().min(1).max(100).openapi({ example: 'David Thomas' }),
    description: z.string().max(2000).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('Book')

export const CreateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).openapi('CreateBook')
export const UpdateBookSchema = CreateBookSchema.partial().openapi('UpdateBook')
export const BookIdParamSchema = z.object({ id: z.string().uuid() })

export type Book = z.infer<typeof BookSchema>
export type CreateBook = z.infer<typeof CreateBookSchema>
export type UpdateBook = z.infer<typeof UpdateBookSchema>
