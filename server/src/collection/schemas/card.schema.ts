import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Collection } from './collection.schema';

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
  @Prop()
  id: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Collection' })
  collection: Collection;

  @Prop()
  termin: string;

  @Prop()
  description: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
