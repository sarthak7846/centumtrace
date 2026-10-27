import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { User } from 'src/auth/user.decorator';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { VolumeRange } from './analytics.types';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(
    @Query('projectId') projectId: string,
    @User() user: UserPayload,
  ) {
    return this.analyticsService.getOverview(projectId, user.sub);
  }

  @Get('volume')
  async getVolume(
    @Query('projectId') projectId: string,
    @Query('range') range: VolumeRange = '24h',
    @User() user: UserPayload,
  ) {
    return this.analyticsService.getVolume(projectId, user.sub, range);
  }

  @Get('latency/trend')
  async getLatencyTrend(
    @Query('projectId') projectId: string,
    @Query('range') range: VolumeRange = '24h',
    @User() user: UserPayload,
  ) {
    return this.analyticsService.getLatencyTrend(projectId, user.sub, range);
  }

  @Get('latency/breakdown')
  async getLatencyBreakdown(
    @Query('projectId') projectId: string,
    @Query('range') range: VolumeRange = '24h',
    @User() user: UserPayload,
  ) {
    return this.analyticsService.getLatencyBreakdown(
      projectId,
      user.sub,
      range,
    );
  }

  @Get('errors/breakdown')
  async getErrorBreakdown(
    @Query('projectId') projectId: string,
    @Query('range') range: VolumeRange = '24h',
    @User() user: UserPayload,
  ) {
    return this.analyticsService.getErrorBreakdown(projectId, user.sub, range);
  }

  @Get('cost/trend')
  async getCostTrend(
    @Query('projectId') projectId: string,
    @Query('range') range: VolumeRange = '24h',
    @User() user: UserPayload,
  ) {
    return this.analyticsService.getCostTrend(projectId, user.sub, range);
  }

  @Get('cost/breakdown')
  async getCostBreakdown(
    @Query('projectId') projectId: string,
    @Query('range') range: VolumeRange = '24h',
    @User() user: UserPayload,
  ) {
    return this.analyticsService.getCostBreakdown(projectId, user.sub, range);
  }
}
