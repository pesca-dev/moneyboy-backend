import variables from "@config/variables";
import { MailService } from "@mail/mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

/**
 * Module handling all mail related things.
 *
 * @author Louis Meyer
 */
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: variables.mail.host,
                port: variables.mail.port,
                auth: variables.mail.auth,
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
