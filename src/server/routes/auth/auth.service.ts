import { Injectable } from "@nestjs/common";
import express from "express";
import jwt from "jsonwebtoken";

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

@Injectable()
export class AuthService {
    public generateRefreshToken(obj: any) {
        return jwt.sign(obj, REFRESH_TOKEN_SECRET ?? "");
    }

    public generateAccessToken(obj: any) {
        return jwt.sign(obj, ACCESS_TOKEN_SECRET ?? "", { expiresIn: "15m" });
    }

    public verifyRefreshToken(token: string, cb: (err: any, decoded: any) => void) {
        jwt.verify(token, REFRESH_TOKEN_SECRET ?? "", cb);
    }

    public static authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1] as string;

        if (!token) {
            res.sendStatus(401);
            return;
        }

        jwt.verify(token, ACCESS_TOKEN_SECRET ?? "", (err, user) => {
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
