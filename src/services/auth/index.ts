import jwt from "jsonwebtoken";
import express from "express";
import { Auth } from "../../api/auth";

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

/**
 * Create and return a module that can be used for token authentication
 */
export function createAuthModule(): Auth.Module {
    function generateRefreshToken(obj: any) {
        return jwt.sign(obj, REFRESH_TOKEN_SECRET ?? "");
    }

    function generateAccessToken(obj: any) {
        return jwt.sign(obj, ACCESS_TOKEN_SECRET ?? "", { expiresIn: "15m" });
    }

    function verifyRefreshToken(token: string, cb: (err: any, decoded: any) => void) {
        jwt.verify(token, REFRESH_TOKEN_SECRET ?? "", cb);
    }

    function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
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

    return Object.freeze({
        generateAccessToken,
        generateRefreshToken,
        verifyRefreshToken,
        authenticateToken,
    });
}
