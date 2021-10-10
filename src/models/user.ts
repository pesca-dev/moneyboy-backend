import { IUser } from "@interfaces/user";
import { Exclude, Expose } from "class-transformer";
import { Column, Entity, PrimaryColumn } from "typeorm";

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

    @Exclude()
    @Column("varchar", {
        length: 255,
    })
    public password!: string;

    @Expose({
        groups: ["self"],
    })
    @Column("varchar", {
        length: 255,
        // TODO lome: Shall mail be "unique"?
        // unique: true,
    })
    public email!: string;

    @Expose({
        groups: ["self"],
    })
    @Column("boolean", {
        default: false,
    })
    public emailVerified!: boolean;

    /**
     * Create a new User instance from the given data.
     */
    public static fromData(data: Restricted<IUser>): User {
        const user = new User();
        Object.assign(user, data);
        return user;
    }
}
