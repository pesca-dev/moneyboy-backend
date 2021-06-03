import { ISession } from "@interfaces/session";
import { User } from "@models/user";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

/**
 * Implementation of a session, which is coupled to a database-schema.
 *
 * @author Louis Meyer
 */
@Entity()
export class Session extends BaseEntity implements ISession {
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    user!: User;

    @Column("bigint")
    createdAt!: number;

    public static fromData(data: ISession): Session {
        const session = new Session();
        Object.assign(session, data);
        return session;
    }
}
