import express from "express";

export namespace Auth {
    interface Module {
        /**
         * Generate and return a new access token for a given object.
         */
        generateAccessToken(obj: any): string;
        /**
         * Generate and return a new refresh token for a given object.
         */
        generateRefreshToken(obj: any): string;
        /**
         * Verify, if a provided refresh token is valid.
         * @param token token to verify
         * @param cb callback to be executed upon verification. First parameter is a possible error, the second is the decoded value for the provided token.
         */
        verifyRefreshToken(token: string, cb: (err: any, decoded: any) => void): void;
        /**
         * Middleware for express to extract and verify a provided token from the auth header.
         */
        authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction): void;
    }
}
