import dotenv from 'dotenv'
import { resolve } from 'node:path'

const NODE_ENV = process.env.NODE_ENV ?? 'development'

const envFiles = {
  development: 'development.env',
  production: 'production.env',
}

dotenv.config({
  path: resolve(process.cwd(), envFiles[NODE_ENV] ?? envFiles.development),
  quiet: true,
})

export const PORT = Number(process.env.PORT) || 3000
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = Number(process.env.DB_PORT) || 3306
export const DB_NAME = process.env.DB_NAME
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
