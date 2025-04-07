import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

export type FeatureDocument = Feature & Document;

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
    testGroup: Types.ObjectId[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
    group: Types.ObjectId;
}

export const FeaturesSchema = SchemaFactory.createForClass(Feature);
