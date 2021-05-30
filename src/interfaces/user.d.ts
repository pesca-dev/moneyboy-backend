/**
 * Interface for data send during registration of a new user.
 *
 * @author Louis Meyer
 */
export interface UserRegisterDTO {
    username: string;
    password: string;
    email: string;
}

/**
 * Interface for data send during login of a user.
 *
 * @author Louis Meyer
 */
export interface UserLoginDTO {
    username: string;
    password: string;
}

/**
 * Interface for the internal repesentation of a user.
 *
 * @author Louis Meyer
 */
export interface IUser {
    id: string;
    username: string;
}
