import variables from "@moneyboy/config/variables";
import { IUser } from "@moneyboy/interfaces/user";
import { User } from "@moneyboy/models/user";
import { CreateUserData, UserService } from "@moneyboy/user/user.service";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hashSync } from "bcrypt";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

const dummyUser: IUser = {
    id: uuid(),
    displayName: "Display Name",
    email: "mail@example.com",
    emailVerified: true,
    password: hashSync("dummyPassword", 10),
    username: "dummyUser",
};

const otherUser: IUser = {
    id: uuid(),
    displayName: "Display Name 2",
    email: "mail2@example.com",
    emailVerified: true,
    password: hashSync("dummyPassword2", 10),
    username: "dummyUser2",
};

const unverifiedUser: IUser = {
    id: uuid(),
    displayName: "Display Name 3",
    email: "mail3@example.com",
    emailVerified: false,
    password: hashSync("dummyPassword2", 10),
    username: "dummyUser3",
};

const users: IUser[] = [dummyUser, otherUser, unverifiedUser];

describe("UserService", () => {
    let userRepoMock: Repository<User>;
    let jwtService: JwtService;
    let userService: UserService;

    beforeEach(() => {
        userRepoMock = new (jest.createMockFromModule<any>("typeorm").Repository)() as Repository<User>;
        jwtService = new JwtService({ secret: variables.token.verifyTokenSecret });
        userService = new UserService(userRepoMock, jwtService);
    });

    describe("findAll", () => {
        let findMock: jest.MockedFunction<() => Promise<User[]>>;

        beforeEach(() => {
            findMock = jest.fn(async () => {
                return users.filter(u => u.emailVerified);
            });
            jest.spyOn(userRepoMock, "find").mockImplementation(findMock);
        });

        it("returns only verified users", async () => {
            await userService.findAll();
            expect(findMock).toHaveBeenCalledWith({ where: { emailVerified: true } });
        });

        it("returns users returned by repo", () => {
            return expect(userService.findAll()).resolves.toEqual(users.filter(u => u.emailVerified));
        });
    });

    describe("findByName", () => {
        let findOneMock: jest.MockedFunction<(arg: any) => Promise<User | undefined>>;

        beforeEach(() => {
            findOneMock = jest.fn(async ({ where: { username } }) => {
                return users.find(u => u.username === username);
            });
            jest.spyOn(userRepoMock, "findOne").mockImplementation(findOneMock);
        });

        it("should return undefined if no user is found", () => {
            return expect(userService.findByName("weirdName")).resolves.toBeUndefined();
        });

        it("should return user with specified username", () => {
            return expect(userService.findByName(dummyUser.username)).resolves.toEqual(dummyUser);
        });
    });

    describe("findById", () => {
        let findOneMock: jest.MockedFunction<(arg: any) => Promise<User | undefined>>;

        beforeEach(() => {
            findOneMock = jest.fn(async ({ where: { id } }) => {
                return users.find(u => u.id === id);
            });
            jest.spyOn(userRepoMock, "findOne").mockImplementation(findOneMock);
        });

        it("should return undefined if no user is found", () => {
            return expect(userService.findById("someWeirdId")).resolves.toBeUndefined();
        });

        it("should return user with specified id", () => {
            return expect(userService.findById(dummyUser.id)).resolves.toEqual(dummyUser);
        });
    });

    describe("createUser", () => {
        let saveMock: jest.MockedFunction<(arg: any) => Promise<User>>;
        const createUserDto: CreateUserData = {
            username: "dummyUserName",
            displayName: "Some DisplayName",
            password: "YesYesPassword",
            email: "mail@example.com",
        };

        beforeEach(() => {
            saveMock = jest.fn();
            jest.spyOn(userRepoMock, "save").mockImplementation(saveMock);
        });

        it("should try to create user in repo", async () => {
            await userService.createUser(createUserDto);
            expect(saveMock).toHaveBeenCalledWith(expect.objectContaining(createUserDto));
        });

        it("should create a user with unverified email", async () => {
            await userService.createUser(createUserDto);
            expect(saveMock).toHaveBeenCalledWith(expect.objectContaining({ emailVerified: false }));
        });

        it("should throw InternalServerErrorException if error happens", () => {
            jest.spyOn(userRepoMock, "save").mockImplementation(async () => {
                throw new Error();
            });
            return expect(userService.createUser(createUserDto)).rejects.toThrowError(InternalServerErrorException);
        });
    });

    describe("updateUser", () => {
        let updateMock: jest.MockedFunction<(arg: any) => Promise<any>>;

        beforeEach(() => {
            updateMock = jest.fn();
            jest.spyOn(userRepoMock, "update").mockImplementation(updateMock);
        });

        it("should update user with specified id", async () => {
            await userService.updateUser(dummyUser);
            expect(updateMock).toHaveBeenCalledWith({ id: dummyUser.id }, dummyUser);
        });
    });

    describe("deleteUser", () => {
        let deleteMock: jest.MockedFunction<(arg: any) => Promise<any>>;

        beforeEach(() => {
            deleteMock = jest.fn();
            jest.spyOn(userRepoMock, "delete").mockImplementation(deleteMock);
        });

        it("should delete specified id from repo", async () => {
            await userService.deleteUser("someId");
            expect(deleteMock).toHaveBeenCalledWith({ id: "someId" });
        });
    });

    describe("verifyUser", () => {
        let findOneMock: jest.MockedFunction<(arg: any) => Promise<User | undefined>>;
        let saveMock: jest.MockedFunction<(arg: any) => Promise<User>>;

        beforeEach(() => {
            findOneMock = jest.fn(async ({ where: { id } }) => {
                return users.find(u => u.id === id);
            });
            jest.spyOn(userRepoMock, "findOne").mockImplementation(findOneMock);
            saveMock = jest.fn();
            jest.spyOn(userRepoMock, "save").mockImplementation(saveMock);
        });

        it("should throw BadRequestException if user is already verified", () => {
            const token = jwtService.sign(dummyUser.id);
            return expect(userService.verifyUser(token)).rejects.toThrowError(BadRequestException);
        });

        it("should throw BadRequestException if user not found", () => {
            const token = jwtService.sign("someWeirdId");
            return expect(userService.verifyUser(token)).rejects.toThrowError(BadRequestException);
        });

        it("should verify an unverified user", async () => {
            const token = jwtService.sign(unverifiedUser.id);
            await userService.verifyUser(token);
            expect(saveMock).toHaveBeenCalledWith({ ...unverifiedUser, emailVerified: true });
        });
    });
});
