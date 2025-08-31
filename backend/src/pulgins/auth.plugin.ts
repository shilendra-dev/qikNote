import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { auth } from '@/auth/auth.js';

export async function authPlugin(fastify: FastifyInstance) {
    fastify.route({
        method: ["GET", "POST"],
        url: "/api/auth/*",
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const url = new URL(request.url, `http://${request.headers.host}`);
                const headers = new Headers();

                Object.entries(request.headers).forEach(([key, value]) => {
                    if (value) {
                        headers.append(key, Array.isArray(value) ? value.join(',') : value.toString());
                    }
                });

                const body = request.method !== 'GET' && request.body ? JSON.stringify(request.body): null;

                const req = new Request(url.toString(), {
                    method: request.method as string,
                    headers,
                    body,
                });

                const response = await auth.handler(req);

                reply.status(response.status);
                response.headers.forEach((value, key) => reply.header(key, value));
                reply.send(response.body ? await response.text() : null);
            } catch (error) {
                fastify.log.error(error, 'Authentication error:');
                reply.status(500).send({
                  error: 'Internal authentication error',
                  code: 'AUTH_FAILURE',
                });
            }
        }
    });
}
