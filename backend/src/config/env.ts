//for environment variables
import { z } from "zod"

const configSchema = z.object({
    server: z.object({
        port: z.coerce.number().default(4000),
        host: z.string().default("localhost"),
        enviroment: z.enum(["development", "production", "test"]).default("development"),
    }),
})

const parsed = configSchema.safeParse({
    server: {
        port: process.env.PORT,
        host: process.env.HOST,
        enviroment: process.env.NODE_ENV,
    }
})

if(!parsed.success){
    console.error("Invalid environment variables:", parsed.error);
    process.exit(1); // fail fast
}

export const config = parsed.data;
