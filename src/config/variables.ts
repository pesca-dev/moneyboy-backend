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
};
