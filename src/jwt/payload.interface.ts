export interface IPayload {
  sub: string;
  exp?: number;
  iat?: number;
  userId: number;
  username: string;
}
