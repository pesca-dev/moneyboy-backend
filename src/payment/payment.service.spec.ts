import { PaymentCreateDTO } from "@moneyboy/interfaces/payment";
import { IUser } from "@moneyboy/interfaces/user";
import { Payment } from "@moneyboy/models/payment";
import { PaymentService } from "@moneyboy/payment/payment.service";
import { UserService } from "@moneyboy/user/user.service";
import { BadRequestException } from "@nestjs/common";
import { hashSync } from "bcrypt";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

const dummyUsers: IUser[] = [
    {
        id: uuid(),
        displayName: "Display Name",
        email: "mail@example.com",
        emailVerified: true,
        password: hashSync("dummyPassword", 10),
        username: "dummyUser",
    },
    {
        id: uuid(),
        displayName: "Other Name",
        email: "other@example.com",
        emailVerified: true,
        password: hashSync("dummyPassword", 10),
        username: "otherUser",
    },
];

const dummyIssuer: IUser = dummyUsers[0];
const dummyTarget: IUser = dummyUsers[1];

const dummyPayment: PaymentCreateDTO = {
    amount: 1337.42,
    date: Date.now(),
    to: dummyTarget.id,
};

describe("PaymentService", () => {
    let userServiceMock: UserService;
    let paymentRepoMock: Repository<Payment>;

    let paymentService: PaymentService;

    beforeEach(() => {
        userServiceMock = new (jest.createMockFromModule<any>("@moneyboy/user/user.service").UserService)();
        paymentRepoMock = new (jest.createMockFromModule<any>("typeorm").Repository)() as Repository<Payment>;
        paymentService = new PaymentService(userServiceMock, paymentRepoMock);
    });

    describe("create", () => {
        let findByIdMock: jest.MockedFunction<(id: string) => Promise<IUser | undefined>>;

        beforeEach(() => {
            findByIdMock = jest.fn(async (id: string) => {
                return dummyUsers.find(user => user.id === id);
            });
            jest.spyOn(userServiceMock, "findById").mockImplementation(findByIdMock);
        });

        it("should be defined", () => {
            expect(paymentService.create).toBeDefined();
        });

        it("should throw BadRequestException, if target user is not defined", () => {
            expect(
                paymentService.create(dummyIssuer, {
                    amount: dummyPayment.amount,
                    date: dummyPayment.date,
                    to: dummyTarget.id + "_invalid",
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
