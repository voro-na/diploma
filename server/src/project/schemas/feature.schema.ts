import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { TestGroup } from './tests.schema';
import { Group } from './group.schema';

@Schema()
export class Feature {
    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ default: 0 })
    allTestCount: number;

    @Prop({ default: 0 })
    passTestCount: number;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'TestGroup' }], default: [] })
    testGroup: TestGroup[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
    group: Group;
}

export const FeaturesSchema = SchemaFactory.createForClass(Feature);
