import express from "express";
import $ from "logsen";

import { authenticateToken } from "./routes/auth";

const posts = [
    {
        username: "louis",
        title: "Post 1",
    },
    {
        username: "tim",
        title: "Post 2",
    },
];

/**
 * Bind all routes for the server.
 *
 * @param server server to bind the routes for
 */
export function bind(server: express.Application, routers?: Map<string, express.Router>) {
    if (routers) {
        for (let [routeName, router] of routers) {
            server.use(routeName, router);
            $.info(`Registered router for route '${routeName}'!`);
        }
    }

    server.get("/posts", authenticateToken, (req, res) => {
        res.json(posts.filter(post => post.username === (req as any).user.name));
    });

    server.get("/", (_, res) => {
        res.send("Hello, world!");
    });
}
