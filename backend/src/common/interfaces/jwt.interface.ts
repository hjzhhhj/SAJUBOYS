export interface JwtPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface UserPayload {
  _id: string;
  email?: string;
  name?: string;
}
