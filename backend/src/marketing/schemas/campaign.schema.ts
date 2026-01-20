import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

export enum CampaignType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  WEB_BANNER = 'WEB_BANNER',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ collection: 'campaigns', timestamps: true })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: String, enum: CampaignType, required: true })
  type: CampaignType;

  @Prop({ type: String, enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop()
  targetAudience?: string;

  @Prop()
  content?: string;

  @Prop()
  subject?: string; // For email campaigns

  @Prop({ default: 0 })
  budget?: number;

  @Prop({ default: 0 })
  leadCount?: number;

  @Prop({ default: 0 })
  conversionRate?: number;

  @Prop({ default: 0 })
  cost?: number;

  @Prop({ default: 0 })
  revenue?: number;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
