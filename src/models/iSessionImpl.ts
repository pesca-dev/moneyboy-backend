import { ISession } from "@interfaces/session";
import { IUserImpl } from "@models/iUserImpl";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

/**
 * Implementation of a session, which is coupled to a database-schema.
 *
 * @author Louis Meyer
 */
@Entity()
export class ISessionImpl extends BaseEntity implements ISession {
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => IUserImpl, user => user.id)
    @JoinColumn()
    user!: IUserImpl;

    @Column("bigint")
    createdAt!: number;

    public static fromData(data: ISession): ISessionImpl {
        const session = new ISessionImpl();
        Object.assign(session, data);
        return session;
    }
}
