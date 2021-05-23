import env from "dotenv";
import { Router } from "express";
env.config();
import $ from "logsen";
import { createAuthRouter } from "./auth";
import { createServer } from "./server";

const PORT = 3000;

(() => {
    const authRouter = createAuthRouter();

    const routers = new Map<string, Router>();
    routers.set("/auth", authRouter);

    const server = createServer({ routers });

    function listenCallback() {
        $.success(`Listening on port :${PORT}`);
    }

    server.listen(PORT, listenCallback);
})();
