import { useBooks } from '../hooks/useBooks'
import { BookCard } from './BookCard'

interface BookListProps {
  onEdit: (id: string) => void
}

export function BookList({ onEdit }: BookListProps) {
  const { data: books, isLoading, isError } = useBooks()

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError) return <p className="text-red-500">Failed to load books.</p>
  if (!books?.length) return <p className="text-gray-500">No books yet. Add one!</p>

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onEdit={onEdit} />
      ))}
    </div>
  )
}
