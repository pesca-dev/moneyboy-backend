import { PaymentDTO } from "@interfaces/payment";
import { IUser } from "@interfaces/user";
import { Payment } from "@models/payment";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "@user/user.service";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

@Injectable()
export class PaymentService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    ) {}

    public async addPayment(from: IUser, { to, date, amount }: PaymentDTO) {
        const target = await this.userService.findOneById(to);
        if (!target) {
            throw new BadRequestException("Target user does not exist.");
        }

        const payment = new Payment();
        payment.id = uuid();
        payment.from = from;
        payment.to = target;
        payment.date = date;
        payment.amount = amount;

        try {
            await this.paymentRepository.save(payment);
        } catch {
            throw new InternalServerErrorException();
        }
    }
}
