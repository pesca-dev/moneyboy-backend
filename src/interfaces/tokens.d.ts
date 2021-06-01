/**
 * Payload for retrieving a new access token.
 */
export interface RefreshTokenDTO {
    refresh_token: string;
}

export interface JWTToken {
    sub: string;
}
