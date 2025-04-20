import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestDto {
  @ApiProperty({
    description: 'Name of the test',
    example: 'Login Test'
  })
  readonly name: string;

  @ApiProperty({
    description: 'Description of the test',
    example: 'Verifies user login functionality',
    required: false
  })
  readonly description?: string;

  @ApiProperty({
    description: 'Link to test details or documentation',
    example: 'https://example.com/tests/login',
    required: false
  })
  readonly link?: string;

  @ApiProperty({
    description: 'Current status of the test',
    example: 'passed',
    enum: ['passed', 'failed', 'skipped', 'pending']
  })
  readonly status: string;
}

export class CreateTestGroupDto {
  @ApiProperty({
    description: 'Name of the test group',
    example: 'Authentication Tests'
  })
  readonly name: string;

  @ApiProperty({
    description: 'Array of tests in the group',
    type: [CreateTestDto]
  })
  readonly tests: CreateTestDto[];
}

export class CreateReportDto {
  @ApiProperty({
    description: 'Feature slug identifier',
    example: 'auth-feature'
  })
  readonly featureSlug: string;

  @ApiProperty({
    description: 'Group slug identifier',
    example: 'login-group'
  })
  readonly groupSlug: string;

  @ApiProperty({
    description: 'Array of test groups in the report',
    type: [CreateTestGroupDto]
  })
  readonly report: CreateTestGroupDto[];
}

export class RemoveTestDto {
  @ApiProperty({
    description: 'Name of the test to remove',
    example: 'Login Test'
  })
  @IsString()
  @IsNotEmpty()
  testName: string;
}

export class EditTestDto {
  @ApiProperty({
    description: 'Name of the test to edit',
    example: 'Login Test'
  })
  @IsString()
  @IsNotEmpty()
  testName: string;
  
  @ApiProperty({
    description: 'New test data',
    type: CreateTestDto
  })
  readonly newData: CreateTestDto;
}

export class ParserTestDto {
  @ApiProperty({
    description: 'Name of the feature',
    example: 'Authentication'
  })
  @IsString()
  @IsNotEmpty()
  featureName: string;

  @ApiProperty({
    description: 'Name of the test group',
    example: 'Login Tests'
  })
  @IsString()
  @IsNotEmpty()
  testGroupName: string;

  @ApiProperty({
    description: 'Name of the test',
    example: 'Should login successfully'
  })
  @IsString()
  @IsNotEmpty()
  testName: string;

  @ApiProperty({
    description: 'Status of the test',
    example: 'passed',
    enum: ['passed', 'failed', 'skipped', 'pending']
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class UpdateTestsFromParserDto {
  @ApiProperty({
    description: 'Array of tests from parser',
    type: [ParserTestDto]
  })
  @IsArray()
  readonly tests: ParserTestDto[];
}
