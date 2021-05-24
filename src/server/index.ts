import express from "express";
import { Auth } from "../api/auth";

import { bind } from "./bind";
import { initServer } from "./init";
import { createAuthRouter } from "./routes/auth";

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
    auth: Auth.Module;
};

/**
 * Create a new server instance.
 *
 * @returns the newly created server instance
 */
export function createServer({ auth }: CreateServerParams): Server {
    const server = initServer();

    const authRouter = createAuthRouter({ auth });

    const routers = new Map<string, express.Router>();
    routers.set("/auth", authRouter);

    bind(server, routers, auth);

    function listen(port: number, cb?: () => void) {
        server.listen(port, cb);
    }

    return {
        listen,
    };
}
