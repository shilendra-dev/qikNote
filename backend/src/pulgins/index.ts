import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';
import { fastifySwagger } from '@fastify/swagger';

export async function registerPlugins(fastify: FastifyInstance) {
    const typedFastify = fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>();

    await typedFastify.register( healthRoutes );
}