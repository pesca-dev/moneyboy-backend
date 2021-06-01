import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller()
export class UserController {
    @Get("profile")
    public getProfile(@Req() req: Request) {
        return req.user;
    }
}
