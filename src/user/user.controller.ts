import { Public } from "@auth/guards/public.guard";
import { BadRequestException, Controller, Get, Req, Res, UnauthorizedException } from "@nestjs/common";
import { UserService } from "@user/user.service";
import { Request, Response } from "express";

/**
 * Controller for handling user-related endpoints.
 */
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("profile")
    public async getProfile(@Req() req: Request) {
        const user = await this.userService.findOneById(req.user?.user?.id ?? "");
        if (!user) {
            throw new UnauthorizedException();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    @Get("verify")
    @Public()
    public async verifyEmail(@Req() req: Request, @Res() res: Response) {
        const token = req.query.t as string;
        if (!token) {
            throw new BadRequestException();
        }
        await this.userService.verifyUser(token);
        res.send("Mail successfully verified!");
    }
}
