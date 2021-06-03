import { IUser } from "@interfaces/user";

/**
 * Data used for storing user sessions internally.
 *
 * @author Louis Meyer
 */
export interface ISession {
    /**
     * Id of this session.
     */
    id: string;
    /**
     * User associated with this session.
     */
    user: IUser;
    /**
     * Date of creation of this session.
     */
    createdAt: number;
}
