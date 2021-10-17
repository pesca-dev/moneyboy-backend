import { ISession } from "@moneyboy/interfaces/session";
import { IUser } from "@moneyboy/interfaces/user";
import { Session } from "@moneyboy/models/session";
import { hashSync } from "bcrypt";
import { v4 as uuid } from "uuid";

describe("Session", () => {
    it("should be defined", () => {
        expect(new Session()).toBeDefined();
    });

    it("should create correct session from data", () => {
        const dummyUser: IUser = {
            id: uuid(),
            displayName: "Display Name",
            email: "mail@example.com",
            emailVerified: true,
            password: hashSync("dummyPassword", 10),
            username: "dummyUser",
        };

        const dummySession: ISession = {
            id: uuid(),
            createdAt: Date.now(),
            user: dummyUser,
        };
        expect(Session.fromData(dummySession)).toEqual(dummySession);
    });
});
