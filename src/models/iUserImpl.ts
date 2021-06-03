import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { IUser } from "@interfaces/user";

/**
 * @author Louis Meyer
 */
@Entity()
export class IUserImpl extends BaseEntity implements IUser {
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

    public static fromData(userData: IUser): IUserImpl {
        const user = new IUserImpl();
        user.id = userData.id;
        user.username = userData.username;
        user.displayName = userData.displayName;
        user.email = userData.email;
        user.password = userData.password;
        return user;
    }
}
