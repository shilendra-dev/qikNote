import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js"; 
import { config } from "@/config/config.js";
 
export const auth = betterAuth({
    ...config.security.auth,
    database: drizzleAdapter(db, {
        provider: "pg", 
    }),
});