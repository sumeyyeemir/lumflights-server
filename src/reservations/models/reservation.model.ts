

import { ApiProperty } from '@nestjs/swagger';

export class Passenger {
  id: string;
  name: string;
  age: number;
  seatNumber: string;
}
export class Reservation {
  @ApiProperty({ example: '1', description: 'Reservation ID' })
  id: string;

  @ApiProperty({ example: 'AB1234', description: 'Flight number' })
  flightNumber: string;

  @ApiProperty({ example: 'New York', description: 'Departure city' })
  departure: string;

  @ApiProperty({ example: 'London', description: 'Arrival city' })
  arrival: string;

  @ApiProperty({ 
    example: '2023-12-25T12:00:00.000Z', 
    description: 'Flight date' 
  })
  date: string;

  @ApiProperty({ 
    type: [Passenger], 
    example: [{ name: 'John Doe', age: 30, seatNumber: 'A1' }],
    description: 'List of passengers' 
  })
  passengers: Passenger[];

  @ApiProperty({
    example: [
      "AI Analysis: This reservation has optimal flight timing.",
      "Recommendation: Consider upgrading to premium class.",
      "Risk Assessment: Low cancellation probability (12%)."
    ],
    description: 'List of comments' 
  })
  comments: string[];
}
  