import { serve } from '@hono/node-server'
import { app } from './app.ts'
import { env } from './env.ts'

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`API server running at http://localhost:${info.port}`)
  console.log(`Docs: http://localhost:${info.port}/docs`)
})
