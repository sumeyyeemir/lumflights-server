import { Controller, Post, Get, UseGuards, Param , Req, Query} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';



@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('generate-bulk')
  @UseGuards(JwtAuthGuard)
  async generateReservations() {
    return this.reservationsService.generateAndSaveReservations();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Req() req: Request,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const user = req.user as { role: 'admin' | 'staff' };
    return this.reservationsService.findAll(user.role, startDate, endDate);
  }
}
