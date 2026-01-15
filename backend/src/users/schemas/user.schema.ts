import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user', timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  image?: string;

  @Prop({ default: 'local' }) // local, google, facebook, etc.
  account_type: string;

  @Prop({ default: 'user' }) // user, admin, moderator, etc.
  role: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  code_id?: string;

  @Prop()
  code_expired?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
