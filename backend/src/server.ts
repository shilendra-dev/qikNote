import Fastify from "fastify";
import { registerPlugins } from "@/pulgins/index.js";
import registerRoutes from "@/router.js";

export async function buildServer(){
    const fastify = Fastify({
        logger: false, //we will use our custom logger
        disableRequestLogging: true,
    })
    //register all plugins
    await registerPlugins(fastify);

    //register all routes
    await fastify.register(registerRoutes);

    return fastify;
}