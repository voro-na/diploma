import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

const enum Status {
  PASS = 'PASS',
  FAIL = 'FAIL',
  SKIP = 'SKIP',
}

@Schema()
export class Test {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  link?: string;

  @Prop()
  status: Status;
}

@Schema()
export class TestGroup {
  @Prop({ required: true })
  name: string;

  @Prop()
  tests: Test[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Feature' })
  feature: Types.ObjectId;
}

export const TestGroupSchema = SchemaFactory.createForClass(TestGroup);
