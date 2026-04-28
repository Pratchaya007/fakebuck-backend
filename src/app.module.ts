import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TypedConfigService } from './config/typed-config.service';

@Module({
  imports: [ConfigModule],
  providers: [TypedConfigService]
})
export class AppModule {}
