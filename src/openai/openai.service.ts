import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { Reservation } from 'src/reservations/models/reservation.model';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private limiter = new RateLimiterMemory({
    points: 60,
    duration: 60,
  });

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
      - Passengers: ${reservation.passengers.map((p) => p.name).join(', ')}

      Provide:
      1. Recommendations for the reservation.
      2. Risk assessment.
      3. A summary of the reservation.
      Format the output as a JSON array of strings.
    `;

    try {
      await this.limiter.consume('openai-api'); 

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      });

      const generatedText = response.choices[0].message.content || '[]';
      return JSON.parse(generatedText);
    } catch (error) {
      console.error('Error in generateAIComments:', error);
      return [];
    }
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

    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await this.limiter.consume('openai-api'); 

        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
        });

        const generatedText = response.choices[0].message.content || '{}';
        const reservation = JSON.parse(generatedText) as Reservation;

        reservation.comments = await this.generateAIComments(reservation);
        return reservation;
      } catch (error) {
        attempt++;

        if (error instanceof Error) {
          if (error.message.includes('rate limit')) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            console.warn(
              `OpenAI rate limit. Retrying in ${Math.round(delay / 1000)}s`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            console.error('Unexpected error:', error);
            throw error;
          }
        } else {
          console.warn(
            `Local rate limit exceeded. Retrying in ${Math.round(
              (error as any).msBeforeNext / 1000
            )}s`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, (error as any).msBeforeNext)
          );
        }
      }
    }

    throw new Error(`Max retries (${maxRetries}) exceeded`);
  }
}
