import { Controller, Get, Req } from "@nestjs/common";
import { UserService } from "@user/user.service";
import { Request } from "express";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("profile")
    public getProfile(@Req() req: Request) {
        return this.userService.findOneById(req.user?.userId ?? "");
    }
}
