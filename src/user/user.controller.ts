import { Public } from "@auth/guards/public.guard";
import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Req,
    Res,
    SerializeOptions,
    UnauthorizedException,
    UseInterceptors,
} from "@nestjs/common";
import { UserService } from "@user/user.service";
import { Request, Response } from "express";

/**
 * Controller for handling user-related endpoints.
 */
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("/all")
    public async getUsers(@Req() req: Request) {
        const users = await this.userService.getAll();
        return users.filter(v => v.id !== req.user?.user?.id);
    }

    @SerializeOptions({
        groups: ["self"],
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("profile")
    public async getProfile(@Req() req: Request) {
        const user = await this.userService.findOneById(req.user?.user?.id ?? "");
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
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
