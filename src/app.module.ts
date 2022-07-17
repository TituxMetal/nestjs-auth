import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from '~/user'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true }), UserModule],
  controllers: []
})
export class AppModule {}
