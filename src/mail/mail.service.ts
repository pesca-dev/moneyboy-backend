import variables from "@config/variables";
import { EVENTS, On } from "@events/event.service";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

/**
 * Service for sending mails.
 *
 * @author Louis Meyer
 */
@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailService: MailerService) {}

    @On("user.created")
    public async sendRegistrationMail({ url, email }: EVENTS["user.created"]) {
        try {
            this.logger.log(`Trying to send registration mail to '${email}'.`);
            await this.mailService.sendMail({
                to: email,
                from: variables.mail.addr,
                subject: "MoneyBoy Registration",
                text: `Thank you for registering for MoneyBoy! To verify your account, please click the following link: ${url}`,
            });
        } catch (e) {
            this.logger.log(`Error sending registration mail: ${e}`);
        }
    }
}
