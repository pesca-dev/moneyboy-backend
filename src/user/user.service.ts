import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

// TODO lome: move this into higher directory
export type User = {
    id: string;
    username: string;
};

const defaultUsers = [
    { username: "louis", password: "1234" },
    { username: "hendrik", password: "changeme" },
];

/**
 * Service for handling users of our application.
 *
 * @author Louis Meyer
 */
@Injectable()
export class UserService {
    private users: User[] = [];

    constructor() {
        defaultUsers.forEach(u => {
            this.users.push({
                ...u,
                id: uuid(),
            });
        });
    }

    /**
     * Find a user by its username.
     */
    public async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

    /**
     * Find a user by its id.
     */
    public async findOneById(id: string): Promise<User | undefined> {
        const user = this.users.find(user => user.id === id);
        if (user) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user as any;
            return result;
        }
        return undefined;
    }
}
