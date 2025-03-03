import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateSubgroupDto {
  @IsString()
  name: string;

  @IsString()
  description?: string;
}

class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSubgroupDto)
  features: CreateSubgroupDto[];
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateGroupDto)
  groups: CreateGroupDto[];
}
