import { IUser } from "@moneyboy/interfaces/user";
import { UserService } from "@moneyboy/user/user.service";
import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Req,
    SerializeOptions,
    UnauthorizedException,
    UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";

/**
 * Controller for handling user-related endpoints.
 */
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public async getAllUsers(): Promise<IUser[]> {
        const users = await this.userService.findAll();
        return users;
    }

    @SerializeOptions({
        groups: ["self"],
    })
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("profile")
    public async getProfile(@Req() req: Request): Promise<IUser> {
        // TODO lome: move this to profile module
        const user = await this.userService.findById(req.user?.id ?? "");
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    /**
     * Get a list of users with a username like the one queried for.
     */
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("like")
    public async getLike(@Req() req: Request): Promise<IUser[]> {
        console.log(req.query);
        return this.userService.findLike((req.query?.q as string) ?? "");
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":id")
    public async getUserById(@Param("id") id: string): Promise<IUser> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new BadRequestException();
        }
        return user;
    }
}
