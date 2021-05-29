import { Module } from "@nestjs/common";
import { UserService } from "user/user.service";

@Module({
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
