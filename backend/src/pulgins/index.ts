import type { TypedFastifyInstance } from "#src/types/fastify";
import fastifyHelmet from "@fastify/helmet"
import fastifyCors from "@fastify/cors"
import fastifyRateLimit from "@fastify/rate-limit"
import { config } from "#src/config/config"

export async function registerPlugins(fastify: TypedFastifyInstance) {
    await fastify.register(fastifyHelmet, config.security.helmet);
    await fastify.register(fastifyCors, config.security.cors);
    await fastify.register(fastifyRateLimit, config.security.rateLimit);
}