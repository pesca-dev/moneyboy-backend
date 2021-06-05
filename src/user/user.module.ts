import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "@user/user.controller";
import { UserService } from "./user.service";
import { User } from "@models/user";
import { JwtModule } from "@nestjs/jwt";

/**
 * Module for managing users.
 *
 * @author Louis Meyer
 */
@Module({
    exports: [UserService],
    providers: [UserService],
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
})
export class UserModule {}
