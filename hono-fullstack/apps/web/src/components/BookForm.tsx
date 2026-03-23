import { useBook, useCreateBook, useUpdateBook } from '../hooks/useBooks'

interface BookFormProps {
  bookId: string | null
  onSuccess: () => void
  onCancel: () => void
}

export function BookForm({ bookId, onSuccess, onCancel }: BookFormProps) {
  const { data: book, isLoading } = useBook(bookId ?? '')
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()

  const isEditing = !!bookId
  const isPending = createBook.isPending || updateBook.isPending
  const error = createBook.error ?? updateBook.error

  // Wait for book data before rendering the form in edit mode, otherwise
  // uncontrolled inputs render with undefined defaultValue and won't update.
  if (isEditing && isLoading) {
    return <p className="text-gray-500 p-6">Loading...</p>
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const payload = {
      title: data.title,
      author: data.author,
      description: data.description || undefined,
    }

    try {
      if (isEditing && bookId) {
        await updateBook.mutateAsync({ id: bookId, ...payload })
      } else {
        await createBook.mutateAsync(payload)
      }
      onSuccess()
    } catch {
      // error is surfaced via mutation.error below
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">{isEditing ? 'Edit Book' : 'Add Book'}</h2>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          id="title"
          name="title"
          defaultValue={book?.title}
          required
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Author *
        </label>
        <input
          id="author"
          name="author"
          defaultValue={book?.author}
          required
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={book?.description}
          rows={3}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
