import { Module } from "@nestjs/common";
import { UserService } from "user/user.service";

/**
 * Module for managing users.
 *
 * @author Louis Meyer
 */
@Module({
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
