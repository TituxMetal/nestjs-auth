import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UserModule } from '~/user'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
