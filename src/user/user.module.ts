import { User } from "@models/user";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
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
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
})
export class UserModule {}
