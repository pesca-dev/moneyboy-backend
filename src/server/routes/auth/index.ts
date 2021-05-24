import express from "express";
import { Auth } from "../../../api/auth";

import { createLoginRoute } from "./login";
import { createRefreshTokenRoute } from "./token";

type CreateAuthRouterParams = {
    auth: Auth.Module;
};

/**
 * Create a router with all relevent auth functions attached.
 * @returns the created router
 */
export function createAuthRouter({ auth }: CreateAuthRouterParams): express.Router {
    const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = auth;

    const router = express.Router();

    const loginRoute = createLoginRoute({ generateAccessToken, generateRefreshToken });
    const refreshTokenRoute = createRefreshTokenRoute({ verifyRefreshToken, generateAccessToken });

    router.post("/login", loginRoute);
    router.post("/token", refreshTokenRoute);

    return router;
}
