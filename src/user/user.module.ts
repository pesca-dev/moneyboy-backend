import { Module } from "@nestjs/common";
import { UserController } from "@user/user.controller";
import { DatabaseModule } from "@database/database.module";

import { UserFactory, UserService, UserServiceKey } from "./user.service";

/**
 * Module for managing users.
 *
 * @author Louis Meyer
 */
@Module({
    exports: [UserServiceKey],
    providers: [UserService, UserFactory],
    controllers: [UserController],
    imports: [DatabaseModule],
})
export class UserModule {}
