import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthPingService {
  private readonly logger = new Logger(HealthPingService.name);
  private readonly isEnabled: boolean;
  private readonly healthUrl: string;

  constructor(private configService: ConfigService) {
    this.isEnabled = this.configService.get<string>('HEALTH_PING_ENABLED') !== 'false';
    const apiUrl = this.configService.get<string>('API_URL') || 
                   this.configService.get<string>('NEXT_PUBLIC_API_URL') || 
                   'http://localhost:3001';
    this.healthUrl = `${apiUrl}/health`;
    
    if (this.isEnabled) {
      this.logger.log(`Health ping cron job enabled. Will ping: ${this.healthUrl}`);
    } else {
      this.logger.log('Health ping cron job is disabled');
    }
  }

  // Run every 10 minutes
  @Cron(CronExpression.EVERY_10_MINUTES)
  async pingHealth() {
    if (!this.isEnabled) {
      return;
    }

    try {
      this.logger.debug(`Pinging health endpoint: ${this.healthUrl}`);
      
      const response = await fetch(this.healthUrl);
      
      if (response.ok) {
        const data = await response.json();
        this.logger.log(`Health ping successful - Status: ${data.status}, Uptime: ${data.uptime}s`);
      } else {
        this.logger.warn(`Health ping returned status: ${response.status}`);
      }
    } catch (error) {
      this.logger.error(`Health ping failed: ${error.message}`);
    }
  }

  // Also run every 5 minutes as backup (optional - can be removed if 10 min is enough)
  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingHealthBackup() {
    if (!this.isEnabled) {
      return;
    }

    try {
      this.logger.debug(`[Backup] Pinging health endpoint: ${this.healthUrl}`);
      
      const response = await fetch(this.healthUrl);
      
      if (response.ok) {
        this.logger.debug('[Backup] Health ping successful');
      }
    } catch (error) {
      this.logger.error(`[Backup] Health ping failed: ${error.message}`);
    }
  }
}
