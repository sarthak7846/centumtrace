import { ForbiddenException, Injectable } from '@nestjs/common';
import { prisma, MembershipRole } from '@observe/db';

@Injectable()
export class MembershipService {
  async createMembership(
    userId: string,
    organizationId: string,
    role: MembershipRole,
  ) {
    const membership = await prisma.membership.create({
      data: {
        organizationId,
        userId,
        role,
      },
    });

    return membership;
  }

  async getMembershipById(userId: string, organizationId: string) {
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        organizationId,
      },
    });

    if (!membership)
      throw new ForbiddenException(
        "Membership doesn't exist for this organization",
      );
  }
}
