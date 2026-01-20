import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LeadDocument = HydratedDocument<Lead>;

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTING = 'CONTACTING',
  INTERESTED = 'INTERESTED',
  NOT_POTENTIAL = 'NOT_POTENTIAL',
  CONVERTED = 'CONVERTED',
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  REFERRAL = 'REFERRAL',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  PHONE = 'PHONE',
  TRADE_SHOW = 'TRADE_SHOW',
  OTHER = 'OTHER',
}

@Schema({ collection: 'leads', timestamps: true })
export class Lead {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  company?: string;

  @Prop({ type: String, enum: LeadSource })
  source?: LeadSource;

  @Prop({ type: String, enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignedTo?: mongoose.Types.ObjectId; // Sales/Marketing person

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;

  @Prop()
  notes?: string;

  @Prop()
  budget?: number;

  @Prop()
  timeline?: string;

  @Prop({ type: Date })
  lastContact?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  convertedToCustomer?: mongoose.Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
