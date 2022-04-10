import { Ability, InferSubjects } from "@casl/ability";
import { AnyObject } from "@casl/ability/dist/types/types";
import { Action, CaslAbilityFactory } from "@moneyboy/casl/casl-ability.factory";
import { IUser } from "@moneyboy/interfaces/user";
import { Payment } from "@moneyboy/models/payment";
import { MongoQuery } from "@ucast/mongo";
import { hashSync } from "bcrypt";
import { v4 as uuid } from "uuid";

const issueUser: IUser = {
    id: uuid(),
    displayName: "Display Name",
    email: "mail@example.com",
    emailVerified: true,
    password: hashSync("dummyPassword", 10),
    username: "dummyUser",
    sessions: [],
};

const targetUser: IUser = {
    id: uuid(),
    displayName: "Other User",
    email: "other@example.com",
    emailVerified: true,
    password: hashSync("otherPassword", 10),
    username: "otherUser",
    sessions: [],
};

const thirdUser: IUser = {
    id: uuid(),
    displayName: "Third User",
    email: "third@example.com",
    emailVerified: true,
    password: hashSync("thirdPassword", 10),
    username: "thirdUser",
    sessions: [],
};

const dummyPayment: Payment = Payment.fromData({
    id: uuid(),
    from: issueUser,
    to: targetUser,
    amount: 1337.42,
    date: Date.now(),
});

describe("CaslAbilityFactory", () => {
    let abilityFactory: CaslAbilityFactory;

    beforeEach(() => {
        abilityFactory = new CaslAbilityFactory();
    });

    describe("createForPayment", () => {
        let issueUserAbility: Ability<[Action, InferSubjects<typeof Payment, false>], MongoQuery<AnyObject>>;
        let targetUserAbility: Ability<[Action, InferSubjects<typeof Payment, false>], MongoQuery<AnyObject>>;
        let thirdUserAbility: Ability<[Action, InferSubjects<typeof Payment, false>], MongoQuery<AnyObject>>;

        beforeEach(() => {
            issueUserAbility = abilityFactory.createForPayment(issueUser);
            targetUserAbility = abilityFactory.createForPayment(targetUser);
            thirdUserAbility = abilityFactory.createForPayment(thirdUser);
        });

        it("shall give 'manage' to Issuer", () => {
            expect(issueUserAbility.can(Action.Manage, dummyPayment)).toBeTruthy();
            expect(issueUserAbility.can(Action.Create, dummyPayment)).toBeTruthy();
            expect(issueUserAbility.can(Action.Delete, dummyPayment)).toBeTruthy();
            expect(issueUserAbility.can(Action.Update, dummyPayment)).toBeTruthy();
            expect(issueUserAbility.can(Action.Manage, dummyPayment)).toBeTruthy();
        });

        it("shall only give 'Read' to target user", () => {
            expect(targetUserAbility.can(Action.Read, dummyPayment)).toBeTruthy();
            expect(targetUserAbility.cannot(Action.Create, dummyPayment)).toBeTruthy();
            expect(targetUserAbility.cannot(Action.Delete, dummyPayment)).toBeTruthy();
            expect(targetUserAbility.cannot(Action.Update, dummyPayment)).toBeTruthy();
            expect(targetUserAbility.cannot(Action.Manage, dummyPayment)).toBeTruthy();
        });

        it("shall block all access to any other user", () => {
            expect(thirdUserAbility.cannot(Action.Read, dummyPayment)).toBeTruthy();
            expect(thirdUserAbility.cannot(Action.Create, dummyPayment)).toBeTruthy();
            expect(thirdUserAbility.cannot(Action.Delete, dummyPayment)).toBeTruthy();
            expect(thirdUserAbility.cannot(Action.Update, dummyPayment)).toBeTruthy();
            expect(thirdUserAbility.cannot(Action.Manage, dummyPayment)).toBeTruthy();
        });
    });
});
