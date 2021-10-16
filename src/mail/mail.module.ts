import variables from "@moneyboy/config/variables";
import { EventModule } from "@moneyboy/events/event.module";
import { MailService } from "@moneyboy/mail/mail.service";
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
        EventModule,
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
