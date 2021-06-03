import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration variables, that can be needed in the entire application.
 */
export default {
    token: {
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
    },
    database: {
        host: process.env.DB_HOST ?? "",
        port: parseInt(process.env.DB_PORT ?? "0"),
        username: process.env.MYSQL_USER ?? "",
        password: process.env.MYSQL_PASSWORD ?? "",
        name: process.env.MYSQL_DATABASE ?? "",
    },
};
