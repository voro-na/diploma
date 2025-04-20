import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'My Test Project'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The URL-friendly slug for the project',
    example: 'my-test-project'
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Optional description of the project',
    example: 'A project for managing test cases',
    required: false
  })
  @IsString()
  description?: string;
}
