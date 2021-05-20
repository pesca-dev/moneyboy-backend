import express from "express";

/**
 * Bind all routes for the server.
 *
 * @param server server to bind the routes for
 */
export function bind(server: express.Application) {
    server.get("/", (_, res) => {
        res.send("Hello, world!");
    });
}
