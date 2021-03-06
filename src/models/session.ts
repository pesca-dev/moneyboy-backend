import { ISession } from "@moneyboy/interfaces/session";
import { User } from "@moneyboy/models/user";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

/**
 * Implementation of a session, which is coupled to a database-schema.
 *
 * @author Louis Meyer
 */
@Entity()
export class Session implements ISession {
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    user!: User;

    @Column("varchar", {
        length: 255,
        nullable: true,
        unique: true,
    })
    notificationToken?: string;

    @Column("bigint")
    createdAt!: number;

    public static fromData(data: Restricted<ISession>): Session {
        const session = new Session();
        Object.assign(session, data);
        return session;
    }
}
