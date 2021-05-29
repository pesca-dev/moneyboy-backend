import { ISession } from "@interfaces/session";
import * as express from "express";

/**
 * Extend the express module a bit, so we can safely store some information in request objects.
 */
declare module "express" {
    interface Request {
        /**
         * Current user session.
         */
        session?: ISession;
    }
}
