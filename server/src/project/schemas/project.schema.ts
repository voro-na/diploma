import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Features {
  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  allTestCount: number;

  @Prop()
  passTestCount: number;
}

@Schema()
export class Group {
  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [Features], default: [] })
  features: Features[];
}

@Schema()
export class Project {
  @Prop({ required: true })
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
export const FeaturesSchema = SchemaFactory.createForClass(Features);
