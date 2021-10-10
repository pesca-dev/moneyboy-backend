import { IPayment, PaymentDTO } from "@interfaces/payment";
import { IUser } from "@interfaces/user";
import { Payment } from "@models/payment";
import { BadRequestException, Injectable, NotImplementedException, UnauthorizedException } from "@nestjs/common";
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

    public async create(from: IUser, { to, date, amount }: PaymentDTO): Promise<IPayment> {
        const target = await this.userService.findById(to);
        if (!target) {
            throw new BadRequestException("Target user does not exist.");
        }

        const payment = new Payment();
        payment.id = uuid();
        payment.from = from;
        payment.to = target;
        payment.date = date;
        payment.amount = amount;

        return this.paymentRepository.save(payment);
    }

    public async findAll(): Promise<IPayment[]> {
        const relations: Keys<Payment> = ["to", "from"];
        return this.paymentRepository.find({
            relations,
        });
    }

    public async findOne(user: IUser, id: string): Promise<IPayment> {
        const relations: Keys<Payment> = ["to", "from"];
        const payment = await this.paymentRepository.findOne({
            where: {
                id: id,
            },
            relations,
        });

        if (!payment || (payment.from.id !== user.id && payment.to.id !== user.id)) {
            throw new UnauthorizedException();
        }

        return payment;
    }

    public async update(_payment: PaymentDTO) {
        throw new NotImplementedException();
    }

    public async remove(_id: string) {
        throw new NotImplementedException();
    }
}
