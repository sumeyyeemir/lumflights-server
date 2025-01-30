import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { OpenAIService } from 'src/openai/openai.service';
import { RoleBasedDataService } from 'src/shared/services/role-based-data.service';


@Module({
  providers: [ReservationsService, OpenAIService, RoleBasedDataService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
