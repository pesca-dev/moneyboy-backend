import { UserRegisterDTO } from "@interfaces/user";
import { IsEmail, IsString } from "class-validator";

export class UserRegisterDTOImpl implements UserRegisterDTO {
    @IsString()
    username!: string;
    @IsString()
    displayName!: string;
    @IsString()
    password!: string;
    @IsEmail()
    email!: string;
}
