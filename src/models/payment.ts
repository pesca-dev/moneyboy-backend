import { IPayment } from "@moneyboy/interfaces/payment";
import { User } from "@moneyboy/models/user";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Payment implements IPayment {
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    from!: User;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    to!: User;

    @Column("double")
    amount!: number;

    @Column("bigint")
    date!: number;

    /**
     * Create a new Payment instance from the given data.
     */
    public static fromData(data: Restricted<IPayment>): Payment {
        const payment = new Payment();
        Object.assign(payment, data);
        return payment;
    }
}
