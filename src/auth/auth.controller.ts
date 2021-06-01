import express from "express";
import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGurad } from "@auth/guards/local-auth.guard";
import { AuthService } from "@auth/auth.service";
import { Public } from "@auth/guards/public.guard";
import { IUser } from "@interfaces/user";

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
    public async postLogin(@Request() req: express.Request) {
        return this.authService.login(req.user as IUser);
    }
}
