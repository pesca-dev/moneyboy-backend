import express from "express";

type GenerateTokenFunction = (obj: any) => string;

type CreateLoginRouteParams = {
    generateAccessToken: GenerateTokenFunction;
    generateRefreshToken: GenerateTokenFunction;
};

export function createLoginRoute({
    generateAccessToken,
    generateRefreshToken,
}: CreateLoginRouteParams): express.RequestHandler {
    return function (req: express.Request, res: express.Response) {
        // TODO lome: add actual authentication
        const username = req.body.username;
        if (!username) {
            // check for invalid request
            res.sendStatus(401);
            return;
        }

        const user = {
            name: username,
        };

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // TODO lome: store refresh tokens somewhere
        // refreshTokens.push(refreshToken);

        res.json({ accessToken, refreshToken });
    };
}
