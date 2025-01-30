import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import {  Reservation } from 'src/reservations/models/reservation.model';

@Injectable()
export class OpenAIService {
  static generateReservation() {
    throw new Error('Method not implemented.');
  }
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateAIComments(reservation: Reservation): Promise<string[]> {
    const prompt = `
      Analyze the following flight reservation and provide AI-generated comments:
      - Flight Number: ${reservation.flightNumber}
      - Departure: ${reservation.departure}
      - Arrival: ${reservation.arrival}
      - Date: ${reservation.date}
      - Passengers: ${reservation.passengers.map(p => p.name).join(', ')}

      Provide:
      1. Recommendations for the reservation.
      2. Risk assessment.
      3. A summary of the reservation.
      Format the output as a JSON array of strings.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const generatedText = response.choices[0].message.content || "";
    return JSON.parse(generatedText);
  }

  async generateReservation(): Promise<Reservation> {
    const prompt = `
      Generate a realistic flight reservation with the following details:
      - Flight number (e.g., AB1234)
      - Departure city (e.g., New York)
      - Arrival city (e.g., London)
      - Date and time (e.g., 2023-12-25T12:00:00.000Z)
      - Passenger details (name, age, seat number) for 1 to 3 passengers
      Format the output as a JSON object with the following structure:
      {
        "flightNumber": string,
        "departure": string,
        "arrival": string,
        "date": string,
        "passengers": [
          {
            "id": string,
            "name": string,
            "age": number,
            "seatNumber": string
          }
        ]
      }
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    const generatedText = response.choices[0].message.content || "";
    const reservation = JSON.parse(generatedText) as Reservation;

    reservation.comments = await this.generateAIComments(reservation);

    return reservation;
  }
}