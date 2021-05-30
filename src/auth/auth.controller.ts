import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { UserLoginDTOImpl, UserRegisterDTOImpl } from "@auth/types/user";
import { AuthService } from "./auth.service";

/**
 * Controller for handling authentication.
 *
 * @author Louis Meyer
 */
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    public postRegister(@Req() _req: Request, @Res() res: Response, @Body() body: UserRegisterDTOImpl) {
        console.log(body);
        res.sendStatus(202);
    }

    @Post("login")
    public postLogin(@Req() _req: Request, @Res() res: Response, @Body() user: UserLoginDTOImpl) {
        const [err, token] = this.authService.login(user);
        if (err) {
            res.sendStatus(401);
        } else {
            res.json(token);
        }
    }

    @Post("token")
    public async postRefreshToken(@Req() req: Request, @Res() res: Response) {
        // TODO lome: refactor
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
        const [err, accessToken] = await this.authService.verifyRefreshToken(refreshToken);
        if (err) {
            res.sendStatus(403);
            return;
        }
        res.json({ accessToken });
    }
}
