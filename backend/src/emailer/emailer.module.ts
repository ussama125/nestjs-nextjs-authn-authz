import { Module } from '@nestjs/common';
import { EmailerController } from './emailer.controller';
import { EmailerService } from './emailer.service';

@Module({
  controllers: [EmailerController],
  providers: [EmailerService],
})
export class EmailerModule {}
