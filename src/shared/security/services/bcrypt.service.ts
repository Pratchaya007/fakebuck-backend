import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { TypedConfigService } from 'src/config/typed-config.service';

@Injectable()
export class BcryptService {
  constructor(private readonly typeConfigService: TypedConfigService) {}
  hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.typeConfigService.get('SALT_ROUNDS'));
  }
}
