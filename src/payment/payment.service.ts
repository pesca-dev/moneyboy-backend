import { IPayment, PaymentCreateDTO, PaymentUpdateDTO } from "@moneyboy/interfaces/payment";
import { IUser } from "@moneyboy/interfaces/user";
import { Payment } from "@moneyboy/models/payment";
import { UserService } from "@moneyboy/user/user.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    ) {}

    public async create(from: IUser, { to, date, amount }: PaymentCreateDTO): Promise<IPayment> {
        const target = await this.userService.findById(to);
        if (!target) {
            throw new BadRequestException("Target user does not exist.");
        }

        const issuer = (await this.userService.findById(from.id)) as IUser;

        const payment = new Payment();
        payment.id = uuid();
        payment.from = issuer;
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
