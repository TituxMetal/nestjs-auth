import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto)
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout() {
    return this.authService.logout()
  }

  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refresh() {
    return this.authService.refreshToken()
  }
}
