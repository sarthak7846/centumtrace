import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TraceStatus } from '@observe/db';

export class TraceQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsEnum(TraceStatus)
  status?: TraceStatus;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  traceId?: string;

  @IsOptional()
  @IsString()
  apiKeyId?: string;

  @IsOptional()
  @IsIn(['24h', '7d', '30d'])
  range?: '24h' | '7d' | '30d';

  @IsOptional()
  @IsIn(['createdAt', 'latencyMs', 'totalCost'])
  sortBy: 'createdAt' | 'latencyMs' | 'totalCost' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minLatency?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxLatency?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minCost?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxCost?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minTokens?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  maxTokens?: number;
}
