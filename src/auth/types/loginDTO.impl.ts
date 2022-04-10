import { UserLoginDTO } from "@moneyboy/interfaces/user";
import { IsOptional, IsString } from "class-validator";

export class UserLoginDTOImpl implements UserLoginDTO {
    @IsString()
    username!: string;
    @IsString()
    password!: string;
    @IsString()
    @IsOptional()
    notificationToken?: string;
}
