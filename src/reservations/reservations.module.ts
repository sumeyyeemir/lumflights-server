import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { OpenAIService } from 'src/openai/openai.service';
import { RoleBasedDataService } from 'src/shared/services/role-based-data.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  providers: [ReservationsService, OpenAIService, RoleBasedDataService, AuthService, JwtService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
