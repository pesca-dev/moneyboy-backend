/**
 * Interface for data send during registration of a new user.
 */
export interface UserRegisterDTO {
    username: string;
    password: string;
    email: string;
}

/**
 * Interface for data send during login of a user.
 */
export interface UserLoginDTO {
    username: string;
    password: string;
}
