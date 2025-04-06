import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Group } from './group.schema';
import { TestGroup } from './tests.schema';

export type ProjectDocument = Project & Document;

@Schema()
export class Feature {
  @Prop({ required: true })
  slug: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  allTestCount: number;

  @Prop()
  passTestCount: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'TestGroup' }], default: [] })
  testGroup: TestGroup[];
}

@Schema()
export class Project {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Group' }], default: [] })
  groups: Group[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export const FeaturesSchema = SchemaFactory.createForClass(Feature);
