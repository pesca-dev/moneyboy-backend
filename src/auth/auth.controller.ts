import { UserLoginDTOImpl, UserRegisterDTOImpl } from "@auth/types/user";
import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    public postRegister(@Req() _req: Request, @Res() res: Response, @Body() body: UserRegisterDTOImpl) {
        console.log(body);
        res.sendStatus(202);
    }

    @Post("login")
    public postLogin(@Req() _req: Request, @Res() res: Response, @Body() body: UserLoginDTOImpl) {
        // TODO lome: add actual authentication
        const username = body.username;
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
