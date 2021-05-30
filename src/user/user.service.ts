import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

import { IUser } from "@interfaces/user";
import { IUserImpl } from "@user/types/user";

/**
 * Service for handling users of our application.
 *
 * @author Louis Meyer
 */
@Injectable()
export class UserService {
    private users: Map<string, IUser> = new Map<string, IUser>();

    public createUser(username: string) {
        const uid = uuid();
        const user = new IUserImpl(uid, username);
        this.users.set(uid, user);
        return uid;
    }

    public getUser(uid: string) {
        return this.users.get(uid);
    }
}
