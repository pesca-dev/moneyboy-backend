import variables from "@moneyboy/config/variables";
import { EVENTS, EventService } from "@moneyboy/events/event.service";
import { MailService } from "@moneyboy/mail/mail.service";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer";
import { v4 as uuid } from "uuid";

describe("MailService", () => {
    let mailerServiceMock: MailerService;
    let eventServiceMock: EventService;
    let mailService: MailService;

    beforeEach(() => {
        mailerServiceMock = new (jest.createMockFromModule<any>("@nestjs-modules/mailer").MailerService)();
        eventServiceMock = new (jest.createMockFromModule<any>("@moneyboy/events/event.service").EventService)();
        mailService = new MailService(mailerServiceMock, eventServiceMock);
    });

    describe("sendRegistrationMail", () => {
        const payload: EVENTS["user.created"] = {
            email: "mail@example.com",
            id: uuid(),
            url: "example.com",
        };

        let emitMock: jest.MockedFunction<(event: string, ...values: any[]) => boolean>;
        let sendMailMock: jest.MockedFunction<(sendMailOptions: ISendMailOptions) => Promise<SentMessageInfo>>;

        beforeEach(() => {
            emitMock = jest.fn();
            jest.spyOn(eventServiceMock, "emit").mockImplementation(emitMock);
            sendMailMock = jest.fn();
            jest.spyOn(mailerServiceMock, "sendMail").mockImplementation(sendMailMock);
        });

        it("shall be defined", () => {
            expect(mailService.sendRegistrationMail).toBeDefined();
        });

        it("shall send try to send mail", async () => {
            await mailService.sendRegistrationMail(payload);
            expect(sendMailMock).toHaveBeenCalledWith(
                expect.objectContaining({ to: payload.email, from: variables.mail.addr }),
            );
        });

        it("shall emit 'registration.maikl.send.error' on failure", async () => {
            jest.spyOn(mailerServiceMock, "sendMail").mockImplementation(async () => {
                throw new Error();
            });
            await mailService.sendRegistrationMail(payload);
            expect(emitMock).toHaveBeenCalledWith("registration.mail.send.error", { id: payload.id });
        });
    });
});
