import Fastify from "fastify"
import { config } from "@/config/env.js";

async function start(){
    const fastify = await buildServer();
}