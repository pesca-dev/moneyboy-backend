import express from "express";
import jwt from "jsonwebtoken";

import { createLoginRoute } from "./login";
import { createRefreshTokenRoute } from "./token";

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

/**
 * Create a router with all relevent auth functions attached.
 * @returns the created router
 */
export function createAuthRouter(): express.Router {
    function generateRefreshToken(obj: any) {
        return jwt.sign(obj, REFRESH_TOKEN_SECRET ?? "");
    }

    function generateAccessToken(obj: any) {
        return jwt.sign(obj, ACCESS_TOKEN_SECRET ?? "", { expiresIn: "15m" });
    }

    function verifyRefreshToken(token: string, cb: (err: any, decoded: any) => void) {
        jwt.verify(token, REFRESH_TOKEN_SECRET ?? "", cb);
    }

    const router = express.Router();

    const loginRoute = createLoginRoute({ generateAccessToken, generateRefreshToken });
    const refreshTokenRoute = createRefreshTokenRoute({ verifyRefreshToken, generateAccessToken });

    router.post("/login", loginRoute);
    router.post("/token", refreshTokenRoute);

    return router;
}

/**
 * Middleware for authenticating a request via checking for a provided token in the auth header.
 */
export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1] as string;

    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET ?? "", (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        (req as any).user = user;
        next();
    });
}
