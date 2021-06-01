import { IUser } from "@interfaces/user";

/**
 * Extend the express module a bit, so we can safely store some information in request objects.
 */
declare module "express" {
    interface Request {
        /**
         * Current user.
         *
         * TODO lome: turn this into session.
         */
        user?: IUser;
    }
}
