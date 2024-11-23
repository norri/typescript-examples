import { Hono } from 'hono'

import books from './routes/books'

const app = new Hono()

app.get('/api/status', (c) => {
  return c.text('ok')
})

app.route('/api/v1/books', books)

export default app
