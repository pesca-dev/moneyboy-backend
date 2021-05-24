import express from "express";

type CreateRefreshTokenRouteParams = {
    /**
     * Verify a provided refresh token.
     */
    verifyRefreshToken: (token: string, cb: (err: any, decoded: any) => void) => void;
    /**
     * Generate a new access token for the passed data.
     */
    generateAccessToken: (obj: any) => string;
};

export function createRefreshTokenRoute({
    verifyRefreshToken,
    generateAccessToken,
}: CreateRefreshTokenRouteParams): express.RequestHandler {
    return function (req: express.Request, res: express.Response) {
        const refreshToken = req.body.token as string;
        if (!refreshToken) {
            res.sendStatus(401);
            return;
        }

        // TODO lome: store refresh tokens somewhere
        // if (!refreshTokens.includes(refreshToken)) {
        //     res.sendStatus(403);
        //     return;
        // }

        verifyRefreshToken(refreshToken, (err, user) => {
            if (err) {
                res.sendStatus(403);
                return;
            }

            const accessToken = generateAccessToken({ name: user.name });
            res.json({ accessToken });
        });
    };
}
