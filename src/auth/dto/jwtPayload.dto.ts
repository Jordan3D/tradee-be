/** payload parsed from jwt */
export interface JwtPayload {
  userId: string;
  role: string;
  type: string;
}
