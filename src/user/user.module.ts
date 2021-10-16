import { User } from "@moneyboy/models/user";
import { UserController } from "@moneyboy/user/user.controller";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
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
