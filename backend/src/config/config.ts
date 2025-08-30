import { z } from "zod";

// Schema
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default(4000),
    HOST: z.string().default('0.0.0.0'),
});

// Helper
const getEnvValue = <T>(values: { development?: T; production?: T; test?: T }, fallback: T): T => {
    const env = (process.env.NODE_ENV as "development" | "production" | "test") || "development";
    return values[env] ?? fallback;
};

// Parse env
const parsedEnv = () => {
    try{
        const env = envSchema.parse(process.env);
        return {
            server: {
                port: env.PORT,
                host: env.HOST,
                environment: env.NODE_ENV,
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
                    
                }
            },
        }
    }catch (error) {
        if (error instanceof z.ZodError) {
          const issues = error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('\n');
    
          console.error('❌ Invalid environment variables:\n', issues);
          process.exit(1);
        }
        throw error;
      }
    };
    
    // Export validated config
    export const config = parsedEnv();
    
    // Export inferred type for use elsewhere
    export type Config = typeof config;
    
    // Helper to check environment
    export const isDevelopment = config.server.environment === 'development';
    export const isProduction = config.server.environment === 'production';
    export const isTest = config.server.environment === 'test';
    
