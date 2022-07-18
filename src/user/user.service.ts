import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { CreateUserDto, UpdateUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { email, password } = dto
    const hash = await argon.hash(password)
    const newUser = { email, hash }
    try {
      const user = await this.prisma.user.create({
        data: newUser,
        select: { id: true, email: true, createdAt: true }
      })

      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('Invalid Credentials')
      }

      throw error
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    })

    return user
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }
}
