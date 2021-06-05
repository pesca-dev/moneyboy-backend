import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration variables, that can be needed in the entire application.
 */
export default {
    host: process.env.HOST ?? "",
    token: {
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
        verifyTokenSecret: process.env.VERIFY_TOKEN_SECRET ?? "",
    },
    database: {
        host: process.env.DB_HOST ?? "",
        port: parseInt(process.env.DB_PORT ?? "0", 10),
        username: process.env.MYSQL_USER ?? "",
        password: process.env.MYSQL_PASSWORD ?? "",
        name: process.env.MYSQL_DATABASE ?? "",
    },
    mail: {
        host: process.env.SMTP_HOST ?? "",
        port: parseInt(process.env.SMTP_PORT ?? "0", 10),
        addr: process.env.SMTP_ADDR ?? "",
        auth: {
            user: process.env.SMTP_USER ?? "",
            pass: process.env.SMTP_PASS ?? "",
        },
    },
};
