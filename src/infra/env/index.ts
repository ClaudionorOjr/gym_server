import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_DB: z.string(),
  COMPOSE_PROJECT_NAME: z.string().optional(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  MAIL_API_KEY: z.string(),
  MAIL_FROM: z.string(),
  MAIL_URL_FORGOT_PASSWORD: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
})

const _env = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_DB: process.env.DATABASE_DB,
  COMPOSE_PROJECT_NAME: process.env.COMPOSE_PROJECT_NAME,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  MAIL_API_KEY: process.env.MAIL_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  MAIL_URL_FORGOT_PASSWORD: process.env.MAIL_URL_FORGOT_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
})

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
