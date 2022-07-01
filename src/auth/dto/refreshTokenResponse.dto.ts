/** login response */
export class RefreshTokenResponseDto {
  /** access jwt token */
  // tslint:disable-next-line: variable-name
  access_token: string;

  /** refresh jwt token */
  // tslint:disable-next-line: variable-name
  refresh_token: string;

  constructor(access_token: string, refresh_token: string) {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
  }
}
