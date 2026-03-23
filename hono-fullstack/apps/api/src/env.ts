import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_BACKEND: z.enum(['memory', 'postgres']).default('memory'),
  DATABASE_URL: z.string().optional(),
})

export const env = EnvSchema.parse(process.env)
export type Env = z.infer<typeof EnvSchema>
