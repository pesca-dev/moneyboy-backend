import express from "express";

import { bind } from "./bind";
import { initServer } from "./init";

export interface Server {
    /**
     * Start listening on a port.
     *
     * @param port port to listen on
     * @param cb callback to execute after starting to listen on a server
     */
    listen(port: number, cb?: () => void): void;
}

type CreateServerParams = {
    routers?: Map<string, express.Router>;
};

/**
 * Create a new server instance.
 *
 * @returns the newly created server instance
 */
export function createServer({ routers }: CreateServerParams): Server {
    const server = initServer();

    bind(server, routers);

    function listen(port: number, cb?: () => void) {
        server.listen(port, cb);
    }

    return {
        listen,
    };
}
