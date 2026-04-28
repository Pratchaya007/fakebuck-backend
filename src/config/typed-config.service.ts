import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigType } from './env.validation';

@Injectable()
export class TypedConfigService {
  constructor(
    private readonly configServiec: ConfigService<EnvConfigType, true>
  ) {}

  get<K extends keyof EnvConfigType>(key: K): EnvConfigType[K] {
    return this.configServiec.get(key, { infer: true });
  }
}
