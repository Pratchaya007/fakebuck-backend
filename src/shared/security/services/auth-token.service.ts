import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypedConfigService } from 'src/config/typed-config.service';
import { JwtPayload } from 'src/types/jwt.payload.type';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly typeConfigService: TypedConfigService,
    private readonly jwtService: JwtService // จาก jwt with method
  ) {}

  //generate accsetoken
  sign(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.typeConfigService.get('JWT_SECRET'),
      expiresIn: this.typeConfigService.get('JWT_EXPIRES_IN')
    });
  }
}
