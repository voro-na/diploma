import { ApiProperty } from '@nestjs/swagger';

export class TestProcessingResultDto {
  @ApiProperty({
    description: 'Name of the test that was processed',
    example: 'Login Test'
  })
  testName: string;

  @ApiProperty({
    description: 'Status of the test processing',
    enum: ['success', 'error'],
    example: 'success'
  })
  status: 'success' | 'error';

  @ApiProperty({
    description: 'Error message if processing failed',
    required: false,
    example: 'Feature not found'
  })
  error?: string;
}
