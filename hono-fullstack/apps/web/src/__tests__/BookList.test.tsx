import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BookList } from '../components/BookList'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('BookList', () => {
  it('shows loading state initially', () => {
    render(<BookList onEdit={() => {}} />, { wrapper })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders books after fetch', async () => {
    render(<BookList onEdit={() => {}} />, { wrapper })
    expect(await screen.findByText('The Pragmatic Programmer')).toBeInTheDocument()
    expect(screen.getByText('Clean Code')).toBeInTheDocument()
  })
})
