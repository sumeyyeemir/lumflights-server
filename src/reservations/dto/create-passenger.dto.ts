import { IsString, IsNumber } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  seatNumber:string;
}
