import { IUser } from "@interfaces/user";
import { User } from "@models/user";
import { BadRequestException, FactoryProvider, InternalServerErrorException } from "@nestjs/common";
import { DatabaseService } from "@database/database.service";
import { v4 as uuid } from "uuid";

interface CreateUserData {
    username: string;
    displayName: string;
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
        if (
            await User.findOne({
                where: {
                    username: userData.username,
                },
            })
        ) {
            throw new BadRequestException("Username already exists");
        }
        const data: IUser = {
            ...userData,
            id: uuid(),
        };
        const user = User.fromData(data);
        try {
            return await user.save();
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    /**
     * Find a user by its username.
     */
    public async findOne(username: string): Promise<IUser | undefined> {
        return User.findOne({
            where: {
                username,
            },
        });
    }

    /**
     * Find a user by its id.
     */
    public async findOneById(id: string): Promise<IUser | undefined> {
        return User.findOne({
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

// TODO lome: do we need this?
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
