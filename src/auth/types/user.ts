import { UserLoginDTO, UserRegisterDTO } from "@interfaces/user";
import { IsEmail, IsString } from "class-validator";

export class UserLoginDTOImpl implements UserLoginDTO {
    @IsString()
    readonly username!: string;

    @IsString()
    readonly password!: string;
}

export class UserRegisterDTOImpl implements UserRegisterDTO {
    @IsString()
    readonly username!: string;

    @IsString()
    readonly password!: string;

    @IsEmail()
    readonly email!: string;
}
