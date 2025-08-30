import { z } from "zod";
import 'dotenv/config';

// Schema
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default(4000),
    HOST: z.string().default('0.0.0.0'),

    DATABASE_URL: z.string().optional(),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().transform(Number).default(5434),
    DB_NAME: z.string().default('quikNote_db'),
    DB_USER: z.string().default('quikNote_user'),
    DB_PASSWORD: z.string().default('quikNote_password'),
});

// Get environment-specific values
const getEnvValue = <T>(values: { development?: T; test?: T; production?: T }, fallback: T): T => {
    const env = process.env.NODE_ENV as 'development' | 'test' | 'production';
    return values[env] ?? fallback;
};

// Parse env
const parseEnv = () => {
    try {
        const env = envSchema.parse(process.env);
        return {
            server: {
                port: env.PORT,
                host: env.HOST,
                environment: env.NODE_ENV,
            },
            database: {
                url:
                    env.DATABASE_URL ||
                    `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
                host: env.DB_HOST,
                port: env.DB_PORT,
                name: env.DB_NAME,
                user: env.DB_USER,
                password: env.DB_PASSWORD,
            },
            security: {
                helmet: {
                    contentSecurityPolicy: getEnvValue(
                        {
                            development: false as false | { directives: Record<string, string[]> },
                            production: {
                                directives: {
                                    defaultSrc: ["'self'"],
                                    styleSrc: ["'self'", "'unsafe-inline'"],
                                    scriptSrc: ["'self'"],
                                    imgSrc: ["'self'", 'data:', 'https:'],
                                },
                            } as false | { directives: Record<string, string[]> },
                        },
                        false as false | { directives: Record<string, string[]> },
                    ),
                },
                cors: {
                    origin: getEnvValue(
                        {
                            development: ['http://localhost:4000', 'http://localhost:5000'] as string[] | boolean,
                            test: false as string[] | boolean,
                            production: ['https://qiknote.pro', 'https://app.qiknote.pro'] as string[] | boolean,
                        },
                        false as string[] | boolean,
                    ),
                    credentials: true,
                },
                rateLimit: {
                    max: getEnvValue({ development: 10000, test: 1000, production: 5000 }, 5000),
                    timeWindow: '15 minutes' as const,
                }
            },
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join('\n');

            console.error('Invalid environment variables:\n', issues);
            process.exit(1);
        }
        throw error;
    }
};

// Export validated config
export const config = parseEnv();

// Export inferred type for use elsewhere
export type Config = typeof config;

// Helper to check environment
export const isDevelopment = config.server.environment === 'development';
export const isProduction = config.server.environment === 'production';
export const isTest = config.server.environment === 'test';

