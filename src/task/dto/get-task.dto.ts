// src/dto/get-tasks.dto.ts
import { Type } from 'class-transformer';

export class GetTasksDto {
  @Type(() => String)
  page?: number;

  @Type(() => Number)
  limit?: number;

  @Type(() => String)
  sortBy?: string;

  @Type(() => String)
  order?: 'asc' | 'desc';
}
