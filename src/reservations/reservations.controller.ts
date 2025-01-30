import { Controller, Post, Get, UseGuards, Param , Req, Query} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Reservation } from './models/reservation.model';


@ApiTags('Reservations')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiQuery({ 
    name: 'startDate', 
    required: false,
    example: '2023-01-01',
    description: 'Filter start date (YYYY-MM-DD)' 
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false,
    example: '2023-12-31',
    description: 'Filter end date (YYYY-MM-DD)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of reservations',
    type: [Reservation] 
  })
  async findAll(
    @Req() req: Request,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const user = req.user as { role: 'admin' | 'staff' };
    return this.reservationsService.findAll(user.role, startDate, endDate);
  }
}
