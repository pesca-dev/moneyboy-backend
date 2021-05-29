import { Injectable } from "@nestjs/common";
import express from "express";
import jwt from "jsonwebtoken";

import variables from "@config/variables";
import { SessionService } from "@session/session.service";

const { accessTokenSecret, refreshTokenSecret } = variables.token;

/**
 * Service for handling and verifying provided auth tokens.
 *
 * @author Louis Meyer
 */
@Injectable()
export class TokenService {
    constructor(private readonly sessionService: SessionService) {}

    public generateRefreshToken(obj: any) {
        return jwt.sign(obj, refreshTokenSecret ?? "");
    }

    public generateAccessToken(obj: any) {
        return jwt.sign(obj, accessTokenSecret ?? "");
    }

    public async verifyRefreshToken(token: string): Promise<[any, any | undefined]> {
        return new Promise(res => {
            jwt.verify(token, refreshTokenSecret ?? "", (err, user) => res([err, user]));
        });
    }

    /**
     * Middleware, which authenticates all requests via the auth header and gets the potential current session and stores it in the current request.
     */
    public authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1] as string;

        if (token) {
            jwt.verify(token, accessTokenSecret ?? "", (err, sessionId) => {
                // send back "unauthorized", if token is provided but invalid
                if (err) {
                    res.sendStatus(401);
                }
                if (sessionId) {
                    const session = this.sessionService.getSession(sessionId as unknown as string);
                    req.session = session;
                }
                next();
            });
        } else {
            next();
        }
    }
}
