import express from "express";
import { json } from "body-parser";

/**
 * Init a new server with some default middleware and return it.
 *
 * @returns initialized express appilication
 */
export function initServer(): express.Application {
    const server = express();

    server.use(json());

    return server;
}
