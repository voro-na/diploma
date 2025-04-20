import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Group } from './group.schema';
import { ApiProperty } from '@nestjs/swagger';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @ApiProperty({
    description: 'Unique identifier for the project',
    example: 'my-test-project'
  })
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty({
    description: 'Name of the project',
    example: 'My Test Project'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Optional description of the project',
    required: false,
    example: 'A project for managing test cases'
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Array of groups in the project',
    type: [Group]
  })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Group' }], default: [] })
  groups: Group[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
