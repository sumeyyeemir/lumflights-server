import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreatePassengerDto {
  @ApiProperty({ example: 'John Doe', description: 'Passenger full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 30, description: 'Passenger age' })
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'A1', description: 'Assigned seat number' })
  @IsString()
  seatNumber: string;
}