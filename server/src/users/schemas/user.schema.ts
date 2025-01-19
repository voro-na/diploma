import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from 'src/collection/schemas/collection.schema';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop({unique: true})
  username: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Collection' }] })
  collections: Collection[];
}

export const UserSchema = SchemaFactory.createForClass(User);
