import type { Book } from '@app/api-types'
import { useDeleteBook } from '../hooks/useBooks'

interface BookCardProps {
  book: Book
  onEdit: (id: string) => void
}

export function BookCard({ book, onEdit }: BookCardProps) {
  const deleteBook = useDeleteBook()

  return (
    <div data-testid="book-card" className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{book.title}</h2>
          <p className="text-gray-600">{book.author}</p>
          {book.description && <p className="text-sm text-gray-700 mt-2">{book.description}</p>}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(book.id)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => deleteBook.mutate(book.id)}
            className="text-red-600 hover:text-red-800 text-sm"
            disabled={deleteBook.isPending}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
