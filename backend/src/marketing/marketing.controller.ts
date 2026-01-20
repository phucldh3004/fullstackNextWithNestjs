import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard, Roles, UserRole } from '../auth/guards/roles.guard';

@Controller('marketing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post('campaigns')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  create(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
    return this.marketingService.create(createCampaignDto, req.user.sub);
  }

  @Get('campaigns')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  findAll() {
    return this.marketingService.findAll();
  }

  @Get('campaigns/:id')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  findOne(@Param('id') id: string) {
    return this.marketingService.findOne(id);
  }

  @Patch('campaigns/:id')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.marketingService.update(id, updateCampaignDto);
  }

  @Delete('campaigns/:id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.marketingService.remove(id);
  }

  @Post('campaigns/:id/send-email')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  sendEmail(@Param('id') id: string) {
    return this.marketingService.sendEmail(id);
  }

  @Post('campaigns/:id/send-sms')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  sendSMS(@Param('id') id: string) {
    return this.marketingService.sendSMS(id);
  }

  @Post('campaigns/:id/track')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  trackResult(@Param('id') id: string, @Body() metrics: any) {
    return this.marketingService.trackCampaignResult(id, metrics);
  }

  @Get('campaigns/:id/roi')
  @Roles(UserRole.ADMIN, UserRole.MARKETING)
  analyzeROI(@Param('id') id: string) {
    return this.marketingService.analyzeROI(id);
  }
}
