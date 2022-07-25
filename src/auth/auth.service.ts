import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'

import { UserService } from '~/user'

import { AuthDto } from './dto'
import { JwtPayload, Tokens } from './types'

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async register(dto: AuthDto): Promise<Tokens> {
    const { id, email } = await this.userService.create(dto)

    return this.generateTokens({ sub: id, email })
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(dto.email, {
      id: true,
      email: true,
      hash: true
    })

    if (!user) {
      throw new UnauthorizedException('Access Denied')
    }

    const { id, email, hash } = user
    const passwordMatches = await argon.verify(hash, dto.password)

    if (!passwordMatches) {
      throw new UnauthorizedException('Access Denied')
    }

    return this.generateTokens({ sub: id, email })
  }

  async logout() {
    console.log('logout method on AuthService Not implemented')
  }

  async refreshToken() {
    console.log('refreshToken method on AuthService Not implemented')
  }

  async generateTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_ACCESS_EXIPIRE')
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_EXIPIRE')
      })
    ])

    await this.updateRefreshToken(jwtPayload.sub, refreshToken)

    return { accessToken, refreshToken }
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = await argon.hash(refreshToken)

    await this.userService.update(userId, { refreshTokenHash: hash })
  }
}
