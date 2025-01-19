import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Card } from './card.schema';
import { User } from 'src/users/schemas/user.schema';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema()
export class Collection {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Card' }] })
  cards: Card[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User; 

  @Prop()
  createdAt: Date;

  @Prop()
  editAt: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
