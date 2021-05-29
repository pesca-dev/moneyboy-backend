import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

import { IsString } from "class-validator";

// TODO lome: move this to extra file
export class User {
    @IsString()
    readonly username!: string;

    @IsString()
    readonly password!: string;
}

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    public postLogin(@Req() req: Request, @Res() res: Response, @Body() body: User) {
        // TODO lome: add actual authentication
        const username = req.body.username;
        console.log(body);
        if (!username) {
            // check for invalid request
            res.sendStatus(401);
            return;
        }

        const user = {
            name: username,
        };

        // TODO lome: maybe do both at once
        const accessToken = this.authService.generateAccessToken(user);
        const refreshToken = this.authService.generateRefreshToken(user);

        // TODO lome: store refresh tokens somewhere
        // refreshTokens.push(refreshToken);

        res.json({ accessToken, refreshToken });
    }

    @Post("token")
    public postRefreshToken(@Req() req: Request, @Res() res: Response) {
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

        this.authService.verifyRefreshToken(refreshToken, (err, user) => {
            if (err) {
                res.sendStatus(403);
                return;
            }

            const accessToken = this.authService.generateAccessToken({ name: user.name });
            res.json({ accessToken });
        });
    }
}
