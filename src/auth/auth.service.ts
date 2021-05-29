import { Injectable } from "@nestjs/common";
import express from "express";
import jwt from "jsonwebtoken";
import config from "@config/variables";

const { accessTokenSecret, refreshTokenSecret } = config.token;

@Injectable()
export class AuthService {
    public generateRefreshToken(obj: any) {
        return jwt.sign(obj, refreshTokenSecret ?? "");
    }

    public generateAccessToken(obj: any) {
        return jwt.sign(obj, accessTokenSecret ?? "", { expiresIn: "15m" });
    }

    public verifyRefreshToken(token: string, cb: (err: any, decoded: any) => void) {
        jwt.verify(token, refreshTokenSecret ?? "", cb);
    }

    public static authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1] as string;

        if (!token) {
            res.sendStatus(401);
            return;
        }

        jwt.verify(token, accessTokenSecret ?? "", (err, user) => {
            if (err) {
                console.log(err);
                res.sendStatus(403);
                return;
            }
            (req as any).user = user;
            next();
        });
    }
}
