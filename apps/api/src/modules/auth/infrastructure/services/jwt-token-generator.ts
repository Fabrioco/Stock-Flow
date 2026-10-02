import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenGenerator, TokenPayload } from '../../domain/services/token-generator.js';

@Injectable()
export class JwtTokenGenerator extends TokenGenerator {
  constructor(private readonly jwt: JwtService) {
    super();
  }

  async sign(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync(payload);
  }
}