import { Session } from "@models/session";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionService } from "@session/session.service";
import { UserModule } from "@user/user.module";

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
