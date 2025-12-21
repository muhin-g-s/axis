import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/app/db/schema',
  out: './src/app/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './db-data/database.db',
  },
});