import { IUser } from "@moneyboy/interfaces/user";
import { Payment } from "@moneyboy/models/payment";
import { hashSync } from "bcrypt";
import { v4 as uuid } from "uuid";

describe("Payment", () => {
    it("should be defined", () => {
        expect(new Payment()).toBeDefined();
    });

    it("should be created by Payment.fromData", () => {
        const issueUser: IUser = {
            id: uuid(),
            displayName: "Display Name",
            email: "mail@example.com",
            emailVerified: true,
            password: hashSync("dummyPassword", 10),
            username: "dummyUser",
        };
        const targetUser: IUser = {
            id: uuid(),
            displayName: "Other User",
            email: "other@example.com",
            emailVerified: true,
            password: hashSync("otherPassword", 10),
            username: "otherUser",
        };
        const dummyPayment: Payment = Payment.fromData({
            id: uuid(),
            from: issueUser,
            to: targetUser,
            amount: 1337.42,
            date: Date.now(),
        });

        expect(Payment.fromData(dummyPayment)).toEqual(dummyPayment);
    });
});
