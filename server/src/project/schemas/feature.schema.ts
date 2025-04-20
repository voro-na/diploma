import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type FeatureDocument = Feature & Document;

@Schema()
export class Feature {
    @ApiProperty({
        description: 'Unique identifier for the feature within a group',
        example: 'login-feature'
    })
    @Prop({ required: true })
    slug: string;

    @ApiProperty({
        description: 'Name of the feature',
        example: 'Login Feature'
    })
    @Prop({ required: true })
    name: string;

    @ApiProperty({
        description: 'Optional description of the feature',
        required: false,
        example: 'User authentication and login functionality'
    })
    @Prop()
    description?: string;

    @ApiProperty({
        description: 'Total number of tests in this feature',
        example: 10,
        minimum: 0
    })
    @Prop({ default: 0 })
    allTestCount: number;

    @ApiProperty({
        description: 'Number of passing tests in this feature',
        example: 8,
        minimum: 0
    })
    @Prop({ default: 0 })
    passTestCount: number;

    @ApiProperty({
        description: 'Array of test group IDs associated with this feature',
        type: [String]
    })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'TestGroup' }], default: [] })
    testGroup: Types.ObjectId[];

    @ApiProperty({
        description: 'Reference to the parent group',
        type: String
    })
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
    group: Types.ObjectId;
}

export const FeaturesSchema = SchemaFactory.createForClass(Feature);
