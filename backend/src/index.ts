import { buildServer } from "@/server.js";
import { config } from "@/config/config.js"
async function start() {
    //builds server with registering plugins, routes
    const fastify = await buildServer();

    //waiting for all plugins to be ready
    fastify.ready();

    //server listening
    await fastify.listen({
        port: config.server.port,
        host: config.server.host,
    });
}

start();