import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BookForm } from '../components/BookForm'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('BookForm', () => {
  it('renders add form when no bookId', () => {
    render(<BookForm bookId={null} onSuccess={() => {}} onCancel={() => {}} />, { wrapper })
    expect(screen.getByText('Add Book')).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument()
  })

  it('submits new book and calls onSuccess', async () => {
    const onSuccess = vi.fn()
    const user = userEvent.setup()

    render(<BookForm bookId={null} onSuccess={onSuccess} onCancel={() => {}} />, { wrapper })

    await user.type(screen.getByLabelText(/title/i), 'Test Book')
    await user.type(screen.getByLabelText(/author/i), 'Test Author')
    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })
})
