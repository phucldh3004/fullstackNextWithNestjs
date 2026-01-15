import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  age: number;
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
