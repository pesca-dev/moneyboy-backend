import variables from "@config/variables";
import { EventService } from "@events/event.service";
import { IUser } from "@interfaces/user";
import { User } from "@models/user";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly eventService: EventService,
        private readonly jwtService: JwtService,
    ) {}

    public async getAll(): Promise<IUser[]> {
        const users = await this.userRepository.find({
            where: {
                emailVerified: true,
            },
        });
        return users;
    }

    /**
     * Create a new user with provided data. If user already exists, resend registration mail.
     */
    public async createUser(userData: CreateUserData): Promise<IUser> {
        // check if user already exists
        let user = await this.userRepository.findOne({
            where: {
                username: userData.username,
            },
        });

        // if user exists
        if (user) {
            // AND (is verified OR the provided email equals the stored one)
            // return BadRequest
            if (user.emailVerified || user.email !== userData.email) {
                throw new BadRequestException("Username already exists");
            }
        } else {
            // else try to save the user
            try {
                user = await this.userRepository.save(
                    User.fromData({
                        ...userData,
                        id: uuid(),
                        emailVerified: false,
                    }),
                );
            } catch (e) {
                throw new InternalServerErrorException();
            }
        }

        // try to send verification mail to user
        const jwt = this.jwtService.sign(user.id, {
            secret: variables.token.verifyTokenSecret,
        });
        const url = `${variables.host}/user/verify?t=${jwt}`;
        this.eventService.emit("user.created", {
            url,
            email: user.email,
        });
        return user;
    }

    /**
     * Change the verification status of a user to true.
     * @param token token with encoded user id
     */
    public async verifyUser(token: string) {
        let id = undefined;
        try {
            id = this.jwtService.verify(token, {
                secret: variables.token.verifyTokenSecret,
            });
        } catch {}
        const user = await this.findOneById(id);
        if (!user || user.emailVerified) {
            throw new BadRequestException();
        }
        user.emailVerified = true;
        await this.userRepository.save(user);
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
