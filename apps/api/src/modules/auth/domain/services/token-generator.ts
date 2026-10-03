export interface TokenPayload {
  sub: string;
  name: string;
  email: string;
}

export abstract class TokenGenerator {
  abstract sign(payload: TokenPayload): Promise<string>;
}