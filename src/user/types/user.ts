import { IUser } from "@interfaces/user";

export class IUserImpl implements IUser {
    constructor(private _id: string, private _username: string) {}

    public get id() {
        return this._id;
    }

    public get username() {
        return this._username;
    }
}
