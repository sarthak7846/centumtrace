import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './user.dto';
import { prisma } from '@observe/db';

@Injectable()
export class UserService {
  async createUser(user: UserDto) {
    const res = await prisma.user.create({
      data: user,
    });
    return res;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
