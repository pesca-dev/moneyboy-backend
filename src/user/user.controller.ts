import { Controller, Get, Inject, Req } from "@nestjs/common";
import { UserService, UserServiceKey } from "@user/user.service";
import { Request } from "express";

/**
 * Controller for handling user-related endpoints.
 */
@Controller()
export class UserController {
    constructor(@Inject(UserServiceKey) private readonly userService: UserService) {}

    @Get("profile")
    public async getProfile(@Req() req: Request) {
        const user = await this.userService.findOneById(req.user?.userId ?? "");
        if (user) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        } else {
            return null;
        }
    }
}
