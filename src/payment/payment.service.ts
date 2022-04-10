import variables from "@moneyboy/config/variables";
import { IPayment, PaymentCreateDTO, PaymentUpdateDTO } from "@moneyboy/interfaces/payment";
import { IUser } from "@moneyboy/interfaces/user";
import { Payment } from "@moneyboy/models/payment";
import { NotificationService } from "@moneyboy/notification/notification.service";
import { UserService } from "@moneyboy/user/user.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "@parse/node-apn";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

/**
 * Class for managing payments.
 *
 * @author Louis Meyer
 */
@Injectable()
export class PaymentService {
    constructor(
        private readonly userService: UserService,
        private readonly notificationsService: NotificationService,
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    ) {}

    public async create(from: IUser, { to, date, amount }: PaymentCreateDTO): Promise<IPayment> {
        const target = await this.userService.findById(to);
        if (!target) {
            throw new BadRequestException("Target user does not exist.");
        }

        const notificationTokens = target.sessions.reduce<string[]>((memo, session) => {
            if (!!session.notificationToken) {
                memo.push(session.notificationToken);
            }
            return memo;
        }, []);

        const issuer = (await this.userService.findById(from.id)) as IUser;

        const payment = Payment.fromData({
            id: uuid(),
            from: issuer,
            to: target,
            date,
            amount,
        });

        const savedPayment = await this.paymentRepository.save(payment);

        const notification = new Notification();
        notification.topic = variables.notifications.topic;
        notification.alert = {
            title: "New Payment!",
            body: `${from.displayName} issued a new payment for you`,
        };
        notification.pushType = "alert";
        notification.priority = 10;

        await this.notificationsService.send(notification, notificationTokens);
        return savedPayment;
    }

    public async findAll(): Promise<IPayment[]> {
        const relations: Keys<Payment> = ["to", "from"];
        return this.paymentRepository.find({
            relations,
        });
    }

    public async findOne(id: string): Promise<IPayment | undefined> {
        const relations: Keys<Payment> = ["to", "from"];
        const payment = await this.paymentRepository.findOne({
            where: {
                id: id,
            },
            relations,
        });

        return payment;
    }

    public async update({ id, to, amount, date }: PaymentUpdateDTO) {
        const target = await this.userService.findById(to);
        if (!target) {
            throw new BadRequestException("Target user does not exist.");
        }

        const payment = await this.findOne(id);
        if (!payment) throw new NotFoundException("payment does not exist");
        payment.to = target;
        payment.date = date;
        payment.amount = amount;
        await this.paymentRepository.save(payment);
    }

    public async remove(id: string) {
        await this.paymentRepository.delete({
            id,
        });
    }
}
