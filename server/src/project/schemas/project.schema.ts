import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TestGroup } from './tests.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Feature {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  allTestCount: number;

  @Prop()
  passTestCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'TestGroup' }], default: [] })
  testGroup: Types.ObjectId[];
}

@Schema()
export class Group {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [Feature], default: [] })
  features: Feature[];
}

@Schema()
export class Project {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [Group], default: [] })
  groups: Group[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export const GroupSchema = SchemaFactory.createForClass(Group);
export const FeaturesSchema = SchemaFactory.createForClass(Feature);
