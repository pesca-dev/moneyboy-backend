import { RefreshTokenDTO } from "@moneyboy/interfaces/tokens";
import { IsString } from "class-validator";

export class RefreshTokenDTOImpl implements RefreshTokenDTO {
    @IsString()
    public refresh_token!: string;
}
