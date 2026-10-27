import { Injectable } from '@nestjs/common';
import { prisma } from '@observe/db';
import { MembershipService } from 'src/membership/membership.service';
import { VolumeRange } from './analytics.types';


@Injectable()
export class AnalyticsService {
  constructor(private readonly membershipService: MembershipService) {}

  async getOverview(projectId: string, userId: string) {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
    });

    await this.membershipService.getMembershipById(
      userId,
      project.organizationId,
    );

    const aggregation = await prisma.trace.aggregate({
      where: {
        projectId,
      },
      _count: {
        _all: true,
      },
      _avg: {
        latencyMs: true,
      },
      _sum: {
        totalTokens: true,
        totalCost: true,
      },
    });

    // Success / error counts
    const statusCounts = await prisma.trace.groupBy({
      by: ['status'],
      where: {
        projectId,
      },
      _count: {
        _all: true,
      },
    });

    const totalTraces = aggregation._count._all;

    const successfulTraces =
      statusCounts.find((item) => item.status === 'SUCCESS')?._count._all ?? 0;

    const errorTraces =
      statusCounts.find((item) => item.status === 'ERROR')?._count._all ?? 0;

    const errorRate = totalTraces > 0 ? (errorTraces / totalTraces) * 100 : 0;

    // Latency percentiles
    const percentileResult = await prisma.$queryRaw<
      {
        p50: number | null;
        p95: number | null;
        p99: number | null;
      }[]
    >`
    SELECT
      PERCENTILE_CONT(0.50)
        WITHIN GROUP (ORDER BY "latencyMs") AS p50,

      PERCENTILE_CONT(0.95)
        WITHIN GROUP (ORDER BY "latencyMs") AS p95,

      PERCENTILE_CONT(0.99)
        WITHIN GROUP (ORDER BY "latencyMs") AS p99

    FROM "Trace"
    WHERE "projectId" = ${projectId}
      AND "latencyMs" IS NOT NULL
  `;

    const percentiles = percentileResult[0];

    return {
      totalTraces,

      successfulTraces,
      errorTraces,
      errorRate: Number(errorRate.toFixed(2)),

      averageLatencyMs: aggregation._avg.latencyMs ?? 0,

      p50LatencyMs: percentiles?.p50 ?? 0,
      p95LatencyMs: percentiles?.p95 ?? 0,
      p99LatencyMs: percentiles?.p99 ?? 0,

      totalTokens: aggregation._sum.totalTokens ?? 0,

      totalCost: aggregation._sum.totalCost?.toNumber() ?? 0,
    };
  }

  async getVolume(
    projectId: string,
    userId: string,
    range: VolumeRange = '24h',
  ) {
    // 1. Verify project exists
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
    });

    // 2. Verify membership
    await this.membershipService.getMembershipById(
      userId,
      project.organizationId,
    );

    const now = new Date();

    let startDate: Date;
    let truncUnit: 'hour' | 'day';

    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        truncUnit = 'day';
        break;

      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        truncUnit = 'day';
        break;

      case '24h':
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        truncUnit = 'hour';
        break;
    }
    //Date truncate - Ignore minutes and seconds and put every trace into its hour.
    const result =
      truncUnit === 'hour'
        ? await prisma.$queryRaw<
            {
              timestamp: Date;
              total: bigint;
              success: bigint;
              errors: bigint;
            }[]
          >`
          SELECT
            DATE_TRUNC('hour', "createdAt") AS timestamp,

            COUNT(*) AS total,

            COUNT(*) FILTER (
              WHERE "status" = 'SUCCESS'
            ) AS success,

            COUNT(*) FILTER (
              WHERE "status" = 'ERROR'
            ) AS errors

          FROM "Trace"

          WHERE
            "projectId" = ${projectId}
            AND "createdAt" >= ${startDate}
            AND "createdAt" <= ${now}

          GROUP BY DATE_TRUNC('hour', "createdAt")

          ORDER BY DATE_TRUNC('hour', "createdAt") ASC
        `
        : await prisma.$queryRaw<
            {
              timestamp: Date;
              total: bigint;
              success: bigint;
              errors: bigint;
            }[]
          >`
          SELECT
            DATE_TRUNC('day', "createdAt") AS timestamp,

            COUNT(*) AS total,

            COUNT(*) FILTER (
              WHERE "status" = 'SUCCESS'
            ) AS success,

            COUNT(*) FILTER (
              WHERE "status" = 'ERROR'
            ) AS errors

          FROM "Trace"

          WHERE
            "projectId" = ${projectId}
            AND "createdAt" >= ${startDate}
            AND "createdAt" <= ${now}

          GROUP BY DATE_TRUNC('day', "createdAt")

          ORDER BY DATE_TRUNC('day', "createdAt") ASC
        `;

    return {
      range,
      interval: truncUnit,
      data: result.map((row) => ({
        timestamp: row.timestamp,
        total: Number(row.total),
        success: Number(row.success),
        errors: Number(row.errors),
      })),
    };
  }

  async getLatencyTrend(
    projectId: string,
    userId: string,
    range: VolumeRange = '24h',
  ) {
    await this.authorizeProject(projectId, userId);

    const { startDate, endDate, interval } = this.getRangeBounds(range);

    const result = await prisma.$queryRaw<
      {
        timestamp: Date;
        traceCount: bigint;
        averageLatencyMs: number | null;
        p50LatencyMs: number | null;
        p95LatencyMs: number | null;
        p99LatencyMs: number | null;
      }[]
    >`
    SELECT
      DATE_TRUNC(${interval}, "createdAt") AS timestamp,
      COUNT(*) AS "traceCount",
      AVG("latencyMs")::float8 AS "averageLatencyMs",

      PERCENTILE_CONT(0.50)
        WITHIN GROUP (ORDER BY "latencyMs")::float8
        AS "p50LatencyMs",

      PERCENTILE_CONT(0.95)
        WITHIN GROUP (ORDER BY "latencyMs")::float8
        AS "p95LatencyMs",

      PERCENTILE_CONT(0.99)
        WITHIN GROUP (ORDER BY "latencyMs")::float8
        AS "p99LatencyMs"

    FROM "Trace"
    WHERE
      "projectId" = ${projectId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
      AND "latencyMs" IS NOT NULL

    GROUP BY 1
    ORDER BY 1 ASC
  `;

    return {
      range,
      interval,
      data: result.map((row) => ({
        timestamp: row.timestamp,
        traceCount: Number(row.traceCount),
        averageLatencyMs: row.averageLatencyMs,
        p50LatencyMs: row.p50LatencyMs,
        p95LatencyMs: row.p95LatencyMs,
        p99LatencyMs: row.p99LatencyMs,
      })),
    };
  }

  async getLatencyBreakdown(
    projectId: string,
    userId: string,
    range: VolumeRange = '24h',
  ) {
    await this.authorizeProject(projectId, userId);

    const { startDate, endDate } = this.getRangeBounds(range);

    const result = await prisma.$queryRaw<
      {
        provider: string;
        model: string;
        traceCount: bigint;
        averageLatencyMs: number | null;
        p50LatencyMs: number | null;
        p95LatencyMs: number | null;
        p99LatencyMs: number | null;
      }[]
    >`
    SELECT
      "provider",
      "model",
      COUNT(*) AS "traceCount",
      AVG("latencyMs")::float8 AS "averageLatencyMs",

      PERCENTILE_CONT(0.50)
        WITHIN GROUP (ORDER BY "latencyMs")::float8
        AS "p50LatencyMs",

      PERCENTILE_CONT(0.95)
        WITHIN GROUP (ORDER BY "latencyMs")::float8
        AS "p95LatencyMs",

      PERCENTILE_CONT(0.99)
        WITHIN GROUP (ORDER BY "latencyMs")::float8
        AS "p99LatencyMs"

    FROM "Trace"
    WHERE
      "projectId" = ${projectId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
      AND "latencyMs" IS NOT NULL

    GROUP BY "provider", "model"
    ORDER BY COUNT(*) DESC
  `;

    return {
      range,
      data: result.map((row) => ({
        provider: row.provider,
        model: row.model,
        traceCount: Number(row.traceCount),
        averageLatencyMs: row.averageLatencyMs,
        p50LatencyMs: row.p50LatencyMs,
        p95LatencyMs: row.p95LatencyMs,
        p99LatencyMs: row.p99LatencyMs,
      })),
    };
  }

  async getErrorBreakdown(
    projectId: string,
    userId: string,
    range: VolumeRange = '24h',
  ) {
    await this.authorizeProject(projectId, userId);

    const { startDate, endDate } = this.getRangeBounds(range);

    const where = {
      projectId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [totalTraces, errorTraces, result] = await Promise.all([
      prisma.trace.count({
        where,
      }),

      prisma.trace.count({
        where: {
          ...where,
          status: 'ERROR',
        },
      }),

      prisma.$queryRaw<
        {
          provider: string;
          model: string;
          errorType: string;
          errorCount: bigint;
        }[]
      >`
      SELECT
        "provider",
        "model",
        COALESCE("errorType", 'UNKNOWN') AS "errorType",
        COUNT(*) AS "errorCount"

      FROM "Trace"
      WHERE
        "projectId" = ${projectId}
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND "status" = 'ERROR'

      GROUP BY
        "provider",
        "model",
        COALESCE("errorType", 'UNKNOWN')

      ORDER BY COUNT(*) DESC
    `,
    ]);

    return {
      range,
      totalTraces,
      errorTraces,
      errorRate:
        totalTraces > 0
          ? Number(((errorTraces / totalTraces) * 100).toFixed(2))
          : 0,

      data: result.map((row) => {
        const errorCount = Number(row.errorCount);

        return {
          provider: row.provider,
          model: row.model,
          errorType: row.errorType,
          errorCount,
          percentageOfErrors:
            errorTraces > 0
              ? Number(((errorCount / errorTraces) * 100).toFixed(2))
              : 0,
        };
      }),
    };
  }

  async getCostBreakdown(
    projectId: string,
    userId: string,
    range: VolumeRange = '24h',
  ) {
    await this.authorizeProject(projectId, userId);

    const { startDate, endDate } = this.getRangeBounds(range);

    const result = await prisma.$queryRaw<
      {
        provider: string;
        model: string;
        traceCount: bigint;
        inputTokens: bigint;
        outputTokens: bigint;
        totalTokens: bigint;
        inputCost: number;
        outputCost: number;
        totalCost: number;
      }[]
    >`
    SELECT
      "provider",
      "model",
      COUNT(*) AS "traceCount",

      COALESCE(SUM("inputTokens"), 0) AS "inputTokens",
      COALESCE(SUM("outputTokens"), 0) AS "outputTokens",
      COALESCE(SUM("totalTokens"), 0) AS "totalTokens",

      COALESCE(SUM("inputCost"), 0)::float8 AS "inputCost",
      COALESCE(SUM("outputCost"), 0)::float8 AS "outputCost",
      COALESCE(SUM("totalCost"), 0)::float8 AS "totalCost"

    FROM "Trace"
    WHERE
      "projectId" = ${projectId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}

    GROUP BY "provider", "model"
    ORDER BY SUM(COALESCE("totalCost", 0)) DESC
  `;

    const data = result.map((row) => ({
      provider: row.provider,
      model: row.model,
      traceCount: Number(row.traceCount),
      inputTokens: Number(row.inputTokens),
      outputTokens: Number(row.outputTokens),
      totalTokens: Number(row.totalTokens),
      inputCost: row.inputCost,
      outputCost: row.outputCost,
      totalCost: row.totalCost,
    }));

    const totalCost = data.reduce((sum, row) => sum + row.totalCost, 0);

    const totalTokens = data.reduce((sum, row) => sum + row.totalTokens, 0);

    return {
      range,
      totalCost: Number(totalCost.toFixed(8)),
      totalTokens,
      data: data.map((row) => ({
        ...row,
        costPercentage:
          totalCost > 0
            ? Number(((row.totalCost / totalCost) * 100).toFixed(2))
            : 0,
      })),
    };
  }

  async getCostTrend(
    projectId: string,
    userId: string,
    range: VolumeRange = '24h',
  ) {
    await this.authorizeProject(projectId, userId);

    const { startDate, endDate, interval } = this.getRangeBounds(range);

    const result = await prisma.$queryRaw<
      {
        timestamp: Date;
        traceCount: bigint;
        inputTokens: bigint;
        outputTokens: bigint;
        totalTokens: bigint;
        totalCost: number;
      }[]
    >`
    SELECT
      DATE_TRUNC(${interval}, "createdAt") AS timestamp,
      COUNT(*) AS "traceCount",

      COALESCE(SUM("inputTokens"), 0) AS "inputTokens",
      COALESCE(SUM("outputTokens"), 0) AS "outputTokens",
      COALESCE(SUM("totalTokens"), 0) AS "totalTokens",

      COALESCE(SUM("totalCost"), 0)::float8 AS "totalCost"

    FROM "Trace"
    WHERE
      "projectId" = ${projectId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}

    GROUP BY 1
    ORDER BY 1 ASC
  `;

    return {
      range,
      interval,
      data: result.map((row) => ({
        timestamp: row.timestamp,
        traceCount: Number(row.traceCount),
        inputTokens: Number(row.inputTokens),
        outputTokens: Number(row.outputTokens),
        totalTokens: Number(row.totalTokens),
        totalCost: row.totalCost,
      })),
    };
  }

  private async authorizeProject(projectId: string, userId: string) {
    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
    });

    await this.membershipService.getMembershipById(
      userId,
      project.organizationId,
    );

    return project;
  }

  private getRangeBounds(range: VolumeRange) {
    const now = new Date();

    const durationMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }[range];

    return {
      startDate: new Date(now.getTime() - durationMs),
      endDate: now,
      interval: (range === '24h' ? 'hour' : 'day') as 'hour' | 'day',
    };
  }
}
