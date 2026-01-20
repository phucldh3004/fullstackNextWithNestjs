import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  async create(createCampaignDto: CreateCampaignDto, createdBy: string) {
    return this.prisma.campaign.create({
      data: {
        ...createCampaignDto,
        createdBy,
      },
      include: {
        createdByUser: true,
      },
    });
  }

  async findAll() {
    return this.prisma.campaign.findMany({
      include: {
        createdByUser: true,
      },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        createdByUser: true,
      },
    });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
      include: {
        createdByUser: true,
      },
    });

    return updatedCampaign;
  }

  async remove(id: string): Promise<void> {
    const result = await this.prisma.campaign.delete({
      where: { id },
    });
    return result;
  }

  // Simulate sending email/SMS (would integrate with actual service)
  async sendEmail(campaignId: string): Promise<{ message: string }> {
    const campaign = await this.findOne(campaignId);
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Sending email campaign: ${campaign.name}`);
    return { message: 'Email campaign sent successfully' };
  }

  async sendSMS(campaignId: string): Promise<{ message: string }> {
    const campaign = await this.findOne(campaignId);
    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`Sending SMS campaign: ${campaign.name}`);
    return { message: 'SMS campaign sent successfully' };
  }

  async trackCampaignResult(campaignId: string, metrics: any) {
    return this.update(campaignId, metrics);
  }

  async analyzeROI(campaignId: string): Promise<{ roi: number; analysis: string }> {
    const campaign = await this.findOne(campaignId);
    const roi = campaign.revenue && campaign.cost ? (campaign.revenue - campaign.cost) / campaign.cost : 0;
    return {
      roi,
      analysis: `Campaign ${campaign.name} has ROI of ${(roi * 100).toFixed(2)}%`
    };
  }
}
