import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Project } from './project.schema';
// import { Feature } from './project.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project' })
    project: Project;

    // @Prop({ type: [Feature], default: [] })
    // features: Feature[];
}

export const GroupSchema = SchemaFactory.createForClass(Group); 