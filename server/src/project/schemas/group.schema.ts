import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Project } from './project.schema';
import { Feature } from './feature.schema';
import { ApiProperty } from '@nestjs/swagger';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
    @ApiProperty({
        description: 'Unique identifier for the group within a project',
        example: 'authentication-tests'
    })
    @Prop({ required: true })
    slug: string;

    @ApiProperty({
        description: 'Name of the group',
        example: 'Authentication Tests'
    })
    @Prop({ required: true })
    name: string;

    @ApiProperty({
        description: 'Optional description of the group',
        required: false,
        example: 'Tests related to user authentication'
    })
    @Prop()
    description?: string;

    @ApiProperty({
        description: 'Reference to the parent project',
        type: () => Project
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project' })
    project: Project;

    @ApiProperty({
        description: 'Array of features in the group',
        type: [Feature]
    })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Feature' }], default: [] })
    features: Feature[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
