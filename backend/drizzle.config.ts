import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from '#src/config/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.url,
  },
});
