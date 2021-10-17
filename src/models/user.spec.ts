import { IUser } from "@moneyboy/interfaces/user";
import { User } from "@moneyboy/models/user";
import { hashSync } from "bcrypt";
import { v4 as uuid } from "uuid";
describe("User", () => {
    it("should be defined", () => {
        expect(new User()).toBeDefined();
    });

    it("should create correct user from data", () => {
        const dummyUser: IUser = {
            id: uuid(),
            displayName: "Display Name",
            email: "mail@example.com",
            emailVerified: true,
            password: hashSync("dummyPassword", 10),
            username: "dummyUser",
        };
        expect(User.fromData(dummyUser)).toEqual(dummyUser);
    });
});
