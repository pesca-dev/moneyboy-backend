import { AuthService, ValidatedUserReturnType } from "@auth/auth.service";
import { LocalAuthGurad } from "@auth/guards/local-auth.guard";
import { Public } from "@auth/guards/public.guard";
import { RefreshTokenDTOImpl } from "@auth/types/refreshTokenDTO.impl";
import { UserRegisterDTOImpl } from "@auth/types/userRegisterDTO.impl";
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Request, Response } from "express";

/**
 * Controller for handling authentication related routes.
 *
 * @author Louis Meyer
 */
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGurad)
    @Throttle()
    @Post("login")
    public async login(@Req() req: Request) {
        // in this case, the req.user property is actually not of type ISession, but
        // just contains a field `id`, which holds the id of the already authenticated user.
        return this.authService.login(req.user as ValidatedUserReturnType);
    }

    @Public()
    @Post("register")
    @HttpCode(HttpStatus.ACCEPTED)
    public async register(@Body() userData: UserRegisterDTOImpl): Promise<void> {
        await this.authService.register(userData);
    }

    @Public()
    @Post("refresh")
    @Throttle()
    public async postRefreshToken(@Body() body: RefreshTokenDTOImpl) {
        return this.authService.renewAccessToken(body.refresh_token);
    }

    @Delete("logout")
    @HttpCode(HttpStatus.ACCEPTED)
    public async logout(@Req() req: Request): Promise<void> {
        await this.authService.logout(req.user);
    }

    @Get("verify")
    @Public()
    public async verifyEmail(@Req() req: Request, @Res() res: Response): Promise<void> {
        const token = req.query.t as string;
        if (!token) {
            throw new BadRequestException();
        }
        await this.authService.verifyUser(token);
        res.send("Mail successfully verified!");
    }
}
