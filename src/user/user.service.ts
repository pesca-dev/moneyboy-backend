import { IUser } from "@interfaces/user";
import { IUserImpl } from "@models/iUserImpl";
import { FactoryProvider } from "@nestjs/common";
import { DatabaseService } from "@database/database.service";
import { v4 as uuid } from "uuid";

interface CreateUserData {
    username: string;
    password: string;
    email: string;
}

/**
 * Service for handling users of our application.
 * Inject it via `@Inject(UserServiceKey)`.
 *
 * @author Louis Meyer
 */
export class UserService {
    /**
     * Create a new user with provided data.
     */
    public async createUser(userData: CreateUserData): Promise<IUser> {
        const data: IUser = {
            ...userData,
            id: uuid(),
        };
        const user = IUserImpl.fromData(data);
        return user.save();
    }

    /**
     * Find a user by its username.
     */
    public async findOne(username: string): Promise<IUser | undefined> {
        return IUserImpl.findOne({
            where: {
                username,
            },
        });
    }

    /**
     * Find a user by its id.
     */
    public async findOneById(id: string): Promise<IUser | undefined> {
        return IUserImpl.findOne({
            where: {
                id,
            },
        });
    }
}

/**
 * Key for injecting the UserService.
 */
export const UserServiceKey = "INJECT_USER_SERVICE_KEY";

/**
 * Factory for creating the UserService.
 */
export const UserFactory: FactoryProvider = {
    useFactory: async () => {
        return new UserService();
    },
    provide: UserServiceKey,
    inject: [DatabaseService],
};