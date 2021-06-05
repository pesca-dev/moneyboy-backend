import { IUser } from "@interfaces/user";
import { User } from "@models/user";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    // TODO lome: https://medium.com/tales-of-libeo/typeorm-best-practices-using-typescript-and-nestjs-at-libeo-b02b7d1ed2eb
    /**
     * Create a new user with provided data.
     */
    public async createUser(userData: CreateUserData): Promise<IUser> {
        if (
            await this.userRepository.findOne({
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
            return await this.userRepository.save(user);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    /**
     * Find a user by its username.
     */
    public async findOne(username: string): Promise<IUser | undefined> {
        return this.userRepository.findOne({
            where: {
                username,
            },
        });
    }

    /**
     * Find a user by its id.
     */
    public async findOneById(id: string): Promise<IUser | undefined> {
        return this.userRepository.findOne({
            where: {
                id,
            },
        });
    }
}
