import { config } from "#src/config/config"
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/postgres-js";

const pool = new Pool({
    connectionString: config.database.url,
    // Production optimizations
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if unable to get connection
});
export const db = drizzle({ client: pool });