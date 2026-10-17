import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto, CreateTraceDto } from './dto/project.dto';
import { OrganizationService } from 'src/organization/organization.service';
import { MembershipService } from 'src/membership/membership.service';
import { createHash, randomBytes } from 'crypto';
import { APIKeyPayload } from './types/api-key.interface';
import { KafkaService } from 'src/kafka/kafka.service';
import { Prisma, prisma, Trace } from '@observe/db';
import { TraceQueryDto } from './dto/trace-query.dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,
    private readonly membershipService: MembershipService,
    private readonly kafkaService: KafkaService,
  ) {}

  async createProject(dto: CreateProjectDto, userId: string) {
    await this.organizationService.getOrganizationById(
      dto.organizationId,
      userId,
    );

    return prisma.project.create({
      data: {
        organizationId: dto.organizationId,
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async getAllProjects(organizationId?: string) {
    const projects = await prisma.project.findMany({
      where: {
        organizationId,
      },
    });

    return projects;
  }

  async createAPIKey(projectId: string, userId: string, name: string) {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
    });

    await this.membershipService.getMembershipById(
      userId,
      project.organizationId,
    );

    // Create a unique key with hash
    const randomPart = randomBytes(32).toString('hex');
    const rawKey = `obs_live_${randomPart}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const { id } = await prisma.aPIKey.create({
      data: {
        projectId,
        name,
        keyHash,
      },
    });

    return {
      id,
      key: rawKey,
      name,
    };
  }

  async getAllAPIKeys(projectId: string, userId: string) {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
    });

    await this.membershipService.getMembershipById(
      userId,
      project.organizationId,
    );

    const apiKeys = await prisma.aPIKey.findMany({
      where: {
        projectId,
      },
    });

    return apiKeys;
  }

  async verifyAPIKey(apiKey: string) {
    const keyHash = createHash('sha256').update(apiKey).digest('hex');

    const apiKeyEntry = await prisma.aPIKey.findFirst({
      where: {
        keyHash,
      },
    });

    if (!apiKeyEntry || apiKeyEntry.revokedAt) return false;

    return {
      id: apiKeyEntry.id,
      projectId: apiKeyEntry.projectId,
    };
  }

  async createTrace(
    createTraceDto: CreateTraceDto,
    apiKeyPayload: APIKeyPayload,
  ) {
    const { projectId, id } = apiKeyPayload;

    await this.kafkaService.publishTrace({
      ...createTraceDto,
      projectId,
      apiKeyId: id,
      input: createTraceDto.input,
      output: createTraceDto.output,
      metadata: createTraceDto.metadata,
      ingestionStartedAt: Date.now(),
    });

    return { accepted: true };
  }

  async getAllTraces(
    projectId: string,
    userId: string,
    query: TraceQueryDto,
  ): Promise<{
    data: Partial<Trace>[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(Math.max(1, query.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Verify that the user belongs to the project's organization.
    await this.membershipService.getMembershipById(
      userId,
      project.organizationId,
    );

    // Build filters.
    const where: Prisma.TraceWhereInput = {
      projectId,
      ...(query.status && {
        status: query.status,
      }),

      ...(query.provider && {
        provider: {
          equals: query.provider,
          mode: 'insensitive',
        },
      }),

      ...(query.model && {
        model: {
          equals: query.model,
          mode: 'insensitive',
        },
      }),

      ...(query.traceId && {
        traceId: {
          contains: query.traceId,
          mode: 'insensitive',
        },
      }),
    };

    // Apply the requested time range.
    if (query.range) {
      const now = new Date();
      const rangeStart = new Date(now);

      switch (query.range) {
        case '24h':
          rangeStart.setHours(rangeStart.getHours() - 24);
          break;

        case '7d':
          rangeStart.setDate(rangeStart.getDate() - 7);
          break;

        case '30d':
          rangeStart.setDate(rangeStart.getDate() - 30);
          break;
      }

      where.createdAt = {
        gte: rangeStart,
        lte: now,
      };
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const orderBy: Prisma.TraceOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [traces, totalCount] = await prisma.$transaction([
      prisma.trace.findMany({
        where,
        select: {
          traceId: true,
          provider: true,
          model: true,
          status: true,
          latencyMs: true,
          totalTokens: true,
          totalCost: true,
          createdAt: true,
          errorType: true,
        },
        orderBy,
        skip,
        take: limit,
      }),

      prisma.trace.count({
        where,
      }),
    ]);

    return {
      data: traces,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit,
    };
  }

  async getTraceDetails(
    projectId: string,
    traceId: string,
    userId: string,
  ): Promise<{
    data: Trace;
  }> {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
    });

    await this.membershipService.getMembershipById(
      userId,
      project.organizationId,
    );

    const trace = await prisma.trace.findFirstOrThrow({
      where: {
        traceId,
      },
    });

    return { data: trace };
  }
}
