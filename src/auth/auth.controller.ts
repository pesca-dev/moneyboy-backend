import express from "express";
import { Body, Controller, Delete, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGurad } from "@auth/guards/local-auth.guard";
import { AuthService, ValidatedUserReturnType } from "@auth/auth.service";
import { Public } from "@auth/guards/public.guard";
import { RefreshTokenDTOImpl } from "@auth/types/refreshToken";
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
    @Post("login")
    public async postLogin(@Req() req: express.Request) {
        // in this case, the req.user property is actually not of type ISession, but
        // just contains a field `id`, which holds the id of the already authenticated user.
        return this.authService.login(req.user as ValidatedUserReturnType);
    }

    @Public()
    @Post("refresh")
    public async postRefreshToken(@Body() body: RefreshTokenDTOImpl) {
        return this.authService.renewAccessToken(body.refresh_token);
    }

    @Delete("logout")
    public async logout(@Res() res: express.Response, @Req() req: express.Request) {
        await this.authService.logout(req.user);
        res.sendStatus(HttpStatus.ACCEPTED);
    }
}
