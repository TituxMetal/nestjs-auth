import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './types'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
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

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    })
  }

  async findByEmail(email: string, options?: object): Promise<User> {
    return this.findByUniqueField({ email }, options)
  }

  async findById(id: string, options?: object): Promise<User> {
    const user = await this.findByUniqueField({ id }, options)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  private async findByUniqueField(
    where: Prisma.UserWhereUniqueInput,
    options?: Prisma.UserSelect
  ): Promise<User> {
    const select = options || { id: true, email: true, createdAt: true, updatedAt: true }
    const user = await this.prisma.user.findUnique({
      where,
      select
    })

    return user as User
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    })
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } })
    } catch (error) {
      console.log(error)
      throw new NotFoundException('No user found')
    }
  }
}
