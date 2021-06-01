import { Module } from "@nestjs/common";
import { UserController } from "@user/user.controller";

import { UserService } from "./user.service";

/**
 * Module for managing users.
 *
 * @author Louis Meyer
 */
@Module({
    exports: [UserService],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
