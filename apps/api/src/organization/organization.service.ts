import { Injectable } from '@nestjs/common';
import { prisma } from '@centumtrace/db';
import { MembershipService } from 'src/membership/membership.service';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly projectService: ProjectService,
  ) {}

  async createOrganization(name: string, slug: string) {
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
      },
    });
    return organization;
  }

  async getOrganizationById(id: string, userId: string) {
    await this.membershipService.getMembershipById(userId, id);

    const organization = await prisma.organization.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return organization;
  }

  async getAllProjectsOfOrganization(organizationId: string, userId: string) {
    await this.membershipService.getMembershipById(userId, organizationId);
    return this.projectService.getAllProjects(organizationId);
  }
}
