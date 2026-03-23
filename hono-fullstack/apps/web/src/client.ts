import { hc } from 'hono/client'
import type { AppType } from '@app/api'

export const client = hc<AppType>('/')
