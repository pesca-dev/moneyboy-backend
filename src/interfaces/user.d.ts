import { Session } from "@moneyboy/models/session";

/**
 * Data send during registration of a new user.
 *
 * @author Louis Meyer
 */
export interface UserRegisterDTO {
    username: string;
    displayName: string;
    password: string;
    email: string;
}

export interface UserLoginDTO {
    username: string;
    password: string;
    notificationToken?: string;
}

/**
 * Interface for the internal repesentation of a user.
 *
 * @author Louis Meyer
 */
export interface IUser {
    /**
     * ID of this user
     */
    id: string;
    /**
     * Username of this user.
     */
    username: string;
    /**
     * display name of the user.
     */
    displayName: string;
    /**
     * Password of this user.
     */
    password: string;
    /**
     * EMail address of this user.
     */
    email: string;

    /**
     * Flag for indicating, that a user verified their email.
     */
    emailVerified: boolean;

    /**
     * Sessions for this user
     */
    sessions: Session[];
}
