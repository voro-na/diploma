import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type Status = 'PASSED' | 'FAILED' | 'SKIPPED';

@Schema()
export class Test {
  @ApiProperty({
    description: 'Name of the test',
    example: 'Should login successfully'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Optional description of the test',
    required: false,
    example: 'Verifies that a user can login with valid credentials'
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Optional link to test details or documentation',
    required: false,
    example: 'https://example.com/tests/login-test'
  })
  @Prop()
  link?: string;

  @ApiProperty({
    description: 'Current status of the test',
    enum: ['PASSED', 'FAILED', 'SKIPPED'],
    example: 'PASSED'
  })
  @Prop()
  status: Status;
}

@Schema()
export class TestGroup {
  @ApiProperty({
    description: 'Name of the test group',
    example: 'Login Tests'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Array of tests in the group',
    type: [Test]
  })
  @Prop()
  tests: Test[];

  @ApiProperty({
    description: 'Reference to the parent feature',
    type: String
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Feature' })
  feature: Types.ObjectId;
}

export const TestGroupSchema = SchemaFactory.createForClass(TestGroup);
