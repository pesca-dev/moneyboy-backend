import { Session } from "@moneyboy/models/session";
import { SessionService } from "@moneyboy/session/session.service";
import { UserModule } from "@moneyboy/user/user.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/**
 * Module for managing login sessions.
 *
 * @author Louis Meyer
 */
@Module({
    providers: [SessionService],
    exports: [SessionService],
    imports: [TypeOrmModule.forFeature([Session]), UserModule],
})
export class SessionModule {}
