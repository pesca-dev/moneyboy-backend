import { PaymentCreateDTO, PaymentUpdateDTO } from "@moneyboy/interfaces/payment";
import { IUser } from "@moneyboy/interfaces/user";
import { Payment } from "@moneyboy/models/payment";
import { NotificationService } from "@moneyboy/notification/notification.service";
import { PaymentService } from "@moneyboy/payment/payment.service";
import { UserService } from "@moneyboy/user/user.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { hashSync } from "bcrypt";
import { DeepPartial, DeleteResult, Repository } from "typeorm";
import { v4 as uuid } from "uuid";

const dummyUsers: IUser[] = [
    {
        id: uuid(),
        displayName: "Display Name",
        email: "mail@example.com",
        emailVerified: true,
        password: hashSync("dummyPassword", 10),
        username: "dummyUser",
        sessions: [],
    },
    {
        id: uuid(),
        displayName: "Other Name",
        email: "other@example.com",
        emailVerified: true,
        password: hashSync("dummyPassword", 10),
        username: "otherUser",
        sessions: [],
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
    let notificationsService: NotificationService;
    let paymentRepoMock: Repository<Payment>;

    let paymentService: PaymentService;

    beforeEach(() => {
        userServiceMock = new (jest.createMockFromModule<any>("@moneyboy/user/user.service").UserService)();
        notificationsService = new (jest.createMockFromModule<any>(
            "@moneyboy/notification/notification.service",
        ).NotificationService)();
        paymentRepoMock = new (jest.createMockFromModule<any>("typeorm").Repository)() as Repository<Payment>;
        paymentService = new PaymentService(userServiceMock, notificationsService, paymentRepoMock);
    });

    describe("create", () => {
        let findByIdMock: jest.MockedFunction<(id: string) => Promise<IUser | undefined>>;
        let saveMock: jest.MockedFunction<(arg0: any) => Promise<DeepPartial<Payment> & Payment>>;

        beforeEach(() => {
            findByIdMock = jest.fn(async (id: string) => {
                return dummyUsers.find(user => user.id === id);
            });
            jest.spyOn(userServiceMock, "findById").mockImplementation(findByIdMock);
            saveMock = jest.fn();
            jest.spyOn(paymentRepoMock, "save").mockImplementation(saveMock);
        });

        it("should be defined", () => {
            expect(paymentService.create).toBeDefined();
        });

        it("should throw BadRequestException, if target user is not defined", () => {
            return expect(
                paymentService.create(dummyIssuer, {
                    amount: dummyPayment.amount,
                    date: dummyPayment.date,
                    to: dummyTarget.id + "_invalid",
                }),
            ).rejects.toThrowError(BadRequestException);
        });

        it("should create a new payment", async () => {
            await paymentService.create(dummyIssuer, dummyPayment);
            expect(saveMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: dummyIssuer,
                    to: dummyTarget,
                    date: dummyPayment.date,
                    amount: dummyPayment.amount,
                }),
            );
        });
    });

    describe("findAll", () => {
        let findMock: jest.MockedFunction<() => Promise<Payment[]>>;
        const payment = Payment.fromData({
            amount: 1337,
            date: Date.now(),
            from: dummyIssuer,
            to: dummyTarget,
            id: uuid(),
        });

        beforeEach(() => {
            findMock = jest.fn(async () => {
                return [payment];
            });
            jest.spyOn(paymentRepoMock, "find").mockImplementation(findMock);
        });

        it("shall return array of payments", () => {
            expect(paymentService.findAll()).resolves.toEqual([payment]);
        });

        it("shall query relations aswell", async () => {
            await paymentService.findAll();
            expect(findMock).toHaveBeenCalledWith({ relations: ["to", "from"] });
        });
    });

    describe("findOne", () => {
        let findOneMock: jest.MockedFunction<(arg0: any) => Promise<Payment | undefined>>;
        const payment = Payment.fromData({
            amount: 1337,
            date: Date.now(),
            from: dummyIssuer,
            to: dummyTarget,
            id: "dummyId",
        });

        beforeEach(() => {
            findOneMock = jest.fn(async ({ where: { id } }) => {
                if (id === payment.id) {
                    return payment;
                }
                return undefined;
            });
            jest.spyOn(paymentRepoMock, "findOne").mockImplementation(findOneMock);
        });

        it("shall return undefined on wrong id", () => {
            return expect(paymentService.findOne("wrongId")).resolves.toBeUndefined();
        });

        it("shall return payment on correct id", () => {
            return expect(paymentService.findOne(payment.id)).resolves.toEqual(payment);
        });

        it("shall query relations aswell", async () => {
            await paymentService.findOne("someId");
            return expect(findOneMock).toHaveBeenCalledWith({ where: { id: "someId" }, relations: ["to", "from"] });
        });
    });

    describe("update", () => {
        let findByIdMock: jest.MockedFunction<(id: string) => Promise<IUser | undefined>>;
        let findOneMock: jest.MockedFunction<(arg0: any) => Promise<Payment | undefined>>;
        let saveMock: jest.MockedFunction<(arg0: any) => Promise<DeepPartial<Payment> & Payment>>;

        const payment = Payment.fromData({
            amount: 1337,
            date: Date.now(),
            from: dummyIssuer,
            to: dummyTarget,
            id: "dummyId",
        });

        beforeEach(() => {
            findByIdMock = jest.fn(async (id: string) => {
                return dummyUsers.find(user => user.id === id);
            });
            jest.spyOn(userServiceMock, "findById").mockImplementation(findByIdMock);
            findOneMock = jest.fn(async ({ where: { id } }) => {
                if (id === payment.id) {
                    return payment;
                }
                return undefined;
            });
            jest.spyOn(paymentRepoMock, "findOne").mockImplementation(findOneMock);

            saveMock = jest.fn();
            jest.spyOn(paymentRepoMock, "save").mockImplementation(saveMock);
        });

        it("shall throw BadRequestException if target user does not exist", () => {
            return expect(
                paymentService.update({
                    id: payment.id,
                    to: "totallyWrong",
                    date: payment.date,
                    amount: payment.amount,
                }),
            ).rejects.toThrowError(BadRequestException);
        });

        it("shall throw NotFoundException if payment does not exist", () => {
            return expect(
                paymentService.update({
                    id: "totallyWrongId",
                    to: dummyTarget.id,
                    date: payment.date,
                    amount: payment.amount,
                }),
            ).rejects.toThrowError(NotFoundException);
        });

        it("shall update payment in repo", async () => {
            const updateDto: PaymentUpdateDTO = {
                amount: 424242,
                date: Date.now(),
                id: payment.id,
                to: dummyIssuer.id,
            };
            await paymentService.update(updateDto);
            expect(saveMock).toHaveBeenCalledWith(
                Payment.fromData({
                    amount: updateDto.amount,
                    to: dummyIssuer,
                    id: updateDto.id,
                    date: updateDto.date,
                    from: dummyIssuer,
                }),
            );
        });
    });

    describe("remove", () => {
        let removeMock: jest.MockedFunction<(arg: any) => Promise<DeleteResult>>;

        beforeEach(() => {
            removeMock = jest.fn();
            jest.spyOn(paymentRepoMock, "delete").mockImplementation(removeMock);
        });

        it("shall remove payment from repo", async () => {
            await paymentService.remove("testId");
            expect(removeMock).toHaveBeenCalledWith({ id: "testId" });
        });
    });
});
