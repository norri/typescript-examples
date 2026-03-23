import { useState } from 'react'
import { BookList } from './components/BookList'
import { BookForm } from './components/BookForm'

export default function App() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Book
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showForm && (
          <div className="mb-8">
            <BookForm
              bookId={editingId}
              onSuccess={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              onCancel={() => {
                setShowForm(false)
                setEditingId(null)
              }}
            />
          </div>
        )}
        <BookList
          onEdit={(id) => {
            setEditingId(id)
            setShowForm(true)
          }}
        />
      </main>
    </div>
  )
}
