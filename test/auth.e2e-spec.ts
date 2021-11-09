import { AppModule } from "@moneyboy/app/app.module";
import { Payment } from "@moneyboy/models/payment";
import { Session } from "@moneyboy/models/session";
import { User } from "@moneyboy/models/user";
import { ValidationPipe } from "@moneyboy/pipes/validation.pipe";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import request from "supertest";

describe("AuthController /auth", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: "sqljs",
                    entities: [User, Session, Payment],
                    synchronize: true,
                }),
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe("/register", () => {
        it("shall return 400 on wrong payload", async () => {
            await request(app.getHttpServer())
                .post("/auth/register")
                .send({
                    userr: "test",
                })
                .expect(400);

            await request(app.getHttpServer())
                .post("/auth/register")
                .send({
                    username: "testUser",
                    password: "samplePassword",
                    displayName: "Test User",
                })
                .expect(400);
        });

        it("shall return 202 on correct registration", async () => {
            await request(app.getHttpServer())
                .post("/auth/register")
                .send({
                    username: "testUser2",
                    password: "samplePassword2",
                    displayName: "Test User2",
                    email: "mail2@example.com",
                })
                .expect(202);
        });
    });

    describe("/login", () => {
        it("returns 401 on wrong credentials", async () => {
            await request(app.getHttpServer())
                .post("/auth/login")
                .send({ username: "test", password: "123" })
                .expect(401);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
