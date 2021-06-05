import { Column, Entity, PrimaryColumn } from "typeorm";
import { IUser } from "@interfaces/user";

/**
 * Implementation of a user, which is coupled to a database schema.
 *
 * @author Louis Meyer
 */
@Entity()
export class User implements IUser {
    // TODO lome: maybe use @PrimaryGeneratedColumn("uuid")
    @PrimaryColumn()
    public id!: string;

    @Column("varchar", {
        length: 255,
        unique: true,
    })
    public username!: string;

    @Column("varchar", {
        length: 255,
    })
    public displayName!: string;

    @Column("varchar", {
        length: 255,
    })
    public password!: string;

    @Column("varchar", {
        length: 255,
        unique: true,
    })
    public email!: string;

    public static fromData(data: IUser): User {
        const user = new User();
        Object.assign(user, data);
        return user;
    }
}
