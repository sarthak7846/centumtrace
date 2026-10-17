
import {
    IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { TraceStatus } from "@observe/db";

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
  @IsIn(["24h", "7d", "30d"])
  range?: "24h" | "7d" | "30d";

  @IsOptional()
  @IsIn(["createdAt", "latencyMs", "totalCost"])
  sortBy: "createdAt" | "latencyMs" | "totalCost" = "createdAt";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder: "asc" | "desc" = "desc";
}
