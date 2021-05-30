import { Injectable } from "@nestjs/common";
import express from "express";
import jwt from "jsonwebtoken";

import variables from "@config/variables";
import { SessionService } from "@session/session.service";
import { Tokenizer } from "@token/types/tokenizer";
import { MaybeError } from "@interfaces/error";

const { accessTokenSecret, refreshTokenSecret } = variables.token;

/**
 * Service for handling and verifying provided auth tokens.
 *
 * @author Louis Meyer
 */
@Injectable()
export class TokenService {
    constructor(private readonly sessionService: SessionService) {}

    /**
     * Generate a refesh token based on a provided session id.
     *
     * @param sessionId id of the session to generate a refresh token for
     * @returns the generated refresh token
     */
    public generateRefreshToken(sessionId: string) {
        const tokenizer = {
            id: sessionId,
        };
        return jwt.sign(tokenizer, refreshTokenSecret ?? "");
    }

    /**
     * Generate access token based on a provided session id.
     *
     * @param sessionId id of the session to generate an access token for.
     * @returns the generated access token
     */
    public generateAccessToken(sessionId: string) {
        const tokenizer = {
            id: sessionId,
        };
        return jwt.sign(tokenizer, accessTokenSecret ?? "");
    }

    /**
     * Verify a provided refresh token and return the session id it belongs to.
     *
     * @param token refresh token to verify
     * @returns the id of the session this refresh token belongs to
     */
    public async verifyRefreshToken(token: string): Promise<MaybeError<string>> {
        return new Promise(res => {
            jwt.verify(token, refreshTokenSecret ?? "", (_err, tokenized) => {
                const sessionId = (tokenized as Tokenizer).value ?? "";
                const session = this.sessionService.getSession(sessionId);
                if (session) {
                    res([null, session.id]);
                } else {
                    res([new Error("Invalid refresh token")]);
                }
            });
        });
    }

    /**
     * Middleware, which authenticates all requests via the auth header and gets the potential current session and stores it in the current request.
     */
    public authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1] as string;

        if (token) {
            jwt.verify(token, accessTokenSecret ?? "", (err, tokenized) => {
                // try to get session for provided token
                const sessionId = (tokenized as Tokenizer)?.value ?? "";
                const session = this.sessionService.getSession(sessionId as unknown as string);

                // send back "unauthorized", if token is provided but invalid or if no session could be found
                if (err || !session) {
                    res.sendStatus(401);
                } else {
                    req.session = session;
                    next();
                }
            });
        } else {
            next();
        }
    }
}
