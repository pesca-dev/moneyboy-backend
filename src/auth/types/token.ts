import { IsString } from "class-validator";

/**
 * Payload for refreshing an access token.
 *
 * @author Louis Meyer
 */
export class RefreshTokenDTO {
    @IsString()
    readonly token!: string;
}
