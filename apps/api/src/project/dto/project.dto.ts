import { TraceStatus } from '@observe/db';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsObject,
  IsISO8601,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class CreateAPIKeyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreateTraceDto {
  @IsString()
  traceId!: string;

  @IsString()
  provider!: string;

  @IsString()
  model!: string;

  @IsEnum(TraceStatus)
  @IsOptional()
  status: TraceStatus = TraceStatus.SUCCESS;

  @IsNumber()
  @Min(0)
  @IsOptional()
  latencyMs?: number;

  @IsISO8601()
  @IsOptional()
  startedAt?: string;

  @IsISO8601()
  @IsOptional()
  endedAt?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  inputTokens?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  outputTokens?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalTokens?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  inputCost?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  outputCost?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalCost?: number;

  @IsObject()
  @IsOptional()
  input?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  output?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  errorType?: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
