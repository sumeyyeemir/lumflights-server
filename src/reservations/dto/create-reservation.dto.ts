import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePassengerDto } from './create-passenger.dto';

export class CreateReservationDto {
  @ApiProperty({ example: 'AB1234', description: 'Flight number' })
  @IsString()
  flightNumber: string;

  @ApiProperty({ example: 'New York', description: 'Departure city' })
  @IsString()
  departure: string;

  @ApiProperty({ example: 'London', description: 'Arrival city' })
  @IsString()
  arrival: string;

  @ApiProperty({ example: '2023-12-25T12:00:00.000Z', description: 'Flight date' })
  @IsDateString()
  date: string;

  @ApiProperty({ 
    type: [CreatePassengerDto],
    example: [{ name: 'John Doe', age: 30, seatNumber: 'A1' }],
    description: 'List of passengers'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePassengerDto)
  passengers: CreatePassengerDto[];
}