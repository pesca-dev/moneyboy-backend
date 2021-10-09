import { Public } from "@auth/guards/public.guard";
import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
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
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("")
    public async getAllUsers() {
        const users = await this.userService.findAll();
        return users;
    }

    @SerializeOptions({
        groups: ["self"],
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("profile")
    public async getProfile(@Req() req: Request) {
        const user = await this.userService.findById(req.user?.id ?? "");
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

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":id")
    public async getUserById(@Param("id") id: string) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new BadRequestException();
        }
        return user;
    }
}
