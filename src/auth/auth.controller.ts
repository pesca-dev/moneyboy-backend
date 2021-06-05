import express from "express";
import { Body, Controller, Delete, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGurad } from "@auth/guards/local-auth.guard";
import { AuthService, ValidatedUserReturnType } from "@auth/auth.service";
import { Public } from "@auth/guards/public.guard";
import { RefreshTokenDTOImpl } from "@auth/types/refreshTokenDTO.impl";
import { UserRegisterDTOImpl } from "@auth/types/userRegisterDTO.impl";
import { Throttle } from "@nestjs/throttler";

/**
 * Controller for handling authentication related routes.
 *
 * @author Louis Meyer
 */
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGurad)
    @Throttle()
    @Post("login")
    public async postLogin(@Req() req: express.Request) {
        // in this case, the req.user property is actually not of type ISession, but
        // just contains a field `id`, which holds the id of the already authenticated user.
        return this.authService.login(req.user as ValidatedUserReturnType);
    }

    @Public()
    @Post("register")
    public async postRegister(@Res() res: express.Response, @Body() userData: UserRegisterDTOImpl) {
        await this.authService.register(userData);
        res.sendStatus(HttpStatus.ACCEPTED);
    }

    @Public()
    @Post("refresh")
    @Throttle()
    public async postRefreshToken(@Body() body: RefreshTokenDTOImpl) {
        return this.authService.renewAccessToken(body.refresh_token);
    }

    @Delete("logout")
    public async logout(@Res() res: express.Response, @Req() req: express.Request) {
        await this.authService.logout(req.user);
        res.sendStatus(HttpStatus.ACCEPTED);
    }
}
