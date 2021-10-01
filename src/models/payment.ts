import { IPayment } from "@interfaces/payment";
import { User } from "@models/user";
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
}
