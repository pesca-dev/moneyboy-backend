import variables from "@moneyboy/config/variables";
import { EVENTS, EventService, On } from "@moneyboy/events/event.service";
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

    constructor(private readonly mailService: MailerService, private readonly eventer: EventService) {}

    @On("user.created")
    public async sendRegistrationMail({ url, email, id }: EVENTS["user.created"]) {
        try {
            this.logger.log(`Trying to send registration mail to '${email}'.`);
            await this.mailService.sendMail({
                to: email,
                from: variables.mail.addr,
                subject: "MoneyBoy Registration",
                text: `Thank you for registering for MoneyBoy! To verify your account, please click the following link: ${url}`,
            });
        } catch (e) {
            this.eventer.emit("registration.mail.send.error", { id });
            this.logger.log(`Error sending registration mail: ${e}`);
        }
    }
}
