import { Injectable } from '@nestjs/common';
import { firestore } from 'src/firebase/firebase.config';
import { Reservation } from './models/reservation.model';
import { OpenAIService } from 'src/openai/openai.service';
import { DateFilterUtil } from 'src/shared/utils/date-filter.util';
import { RoleBasedDataService } from 'src/shared/services/role-based-data.service';



@Injectable()
export class ReservationsService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly roleBasedDataService: RoleBasedDataService
) {}


  async findAll(role: 'admin' | 'staff', startDate?: string, endDate?: string): Promise<Partial<Reservation>[]> {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = firestore.collection('reservations');

    query = DateFilterUtil.applyDateFilter(query, startDate, endDate);

    const snapshot = await query.get();

    if (snapshot.empty) {
      return [
        {
          "id": "1",
          "flightNumber": "AB1234",
          "departure": "New York",
          "arrival": "London",
          "date": "2023-12-25T12:00:00.000Z",
          "passengers": [
            {
              "name": "John Doe",
              "age": 30,
              "seatNumber": "A1"
            }
          ],
          "comments": [
            "AI Analysis: This reservation has optimal flight timing.",
            "Recommendation: Consider upgrading to premium class.",
            "Risk Assessment: Low cancellation probability (12%)."
          ]
        },
        {
          "id": "2",
          "flightNumber": "AB1234",
          "departure": "New York",
          "arrival": "London",
          "date": "2023-12-25T12:00:00.000Z",
          "passengers": [
            {
              "name": "John Doe",
              "age": 30,
              "seatNumber": "A1"
            }
          ],
          "comments": [
            "AI Analysis: This reservation has optimal flight timing.",
            "Recommendation: Consider upgrading to premium class.",
            "Risk Assessment: Low cancellation probability (12%)."
          ]
        },
        {
          "id": "3",
          "flightNumber": "AB1234",
          "departure": "New York",
          "arrival": "London",
          "date": "2023-12-25T12:00:00.000Z",
          "passengers": [
            {
              "name": "John Doe",
              "age": 30,
              "seatNumber": "A1"
            }
          ],
          "comments": [
            "AI Analysis: This reservation has optimal flight timing.",
            "Recommendation: Consider upgrading to premium class.",
            "Risk Assessment: Low cancellation probability (12%)."
          ]
        },
        {
          "id": "4",
          "flightNumber": "AB1234",
          "departure": "New York",
          "arrival": "London",
          "date": "2023-12-25T12:00:00.000Z",
          "passengers": [
            {
              "name": "John Doe",
              "age": 30,
              "seatNumber": "A1"
            }
          ],
          "comments": [
            "AI Analysis: This reservation has optimal flight timing.",
            "Recommendation: Consider upgrading to premium class.",
            "Risk Assessment: Low cancellation probability (12%)."
          ]
        }
      ]
      
    }

    return snapshot.docs.map((doc) => {
      const reservation = doc.data() as Reservation;
      return this.roleBasedDataService.filterReservationByRole(reservation, role);
    });
  }

  async generateAndSaveReservations(): Promise<{ success: boolean; count: number }> {
    const reservationsCollection = firestore.collection('reservations');
    const batchSize = 20; 
    const totalReservations = 1000;
    let generatedCount = 0;

    for (let i = 0; i < totalReservations; i += batchSize) {
      console.log(`Generating batch ${i + 1} to ${i + batchSize}...`);

      const batch = firestore.batch();
      const promises: Promise<Reservation>[] = [];

      for (let j = 0; j < batchSize; j++) {
        const promise = this.retryWithBackoff(() => this.openaiService.generateReservation(), 5);
        promises.push(promise);
      }

      try {
        const reservations = await Promise.all(promises);

        for (const reservation of reservations) {
          const reservationRef = reservationsCollection.doc();
          batch.set(reservationRef, { ...reservation, id: reservationRef.id });
          generatedCount++;
        }

        await batch.commit();
        console.log(`✅ Batch ${i + 1} - ${i + batchSize} saved successfully.`);
      } catch (error) {
        console.error('🚨 Error generating reservations:', error);
      }

      console.log(`⏳ Waiting before next batch...`);
      await this.sleep(10000); 
    }

    return {
      success: true,
      count: generatedCount,
    };
  }

  /** 
   * OpenAI rate limit hatalarında bekleyerek tekrar deneme (Exponential Backoff)
   */
  private async retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;

        if (error instanceof Error && error.message.includes('rate limit')) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.warn(`🔄 OpenAI rate limit. Retrying in ${Math.round(delay / 1000)}s`);
          await this.sleep(delay);
        } else {
          console.error('❌ Unexpected error:', error);
          throw error;
        }
      }
    }

    throw new Error(`🚨 Max retries (${maxRetries}) exceeded`);
  }

  /**
   * Belirtilen süre boyunca bekleyen yardımcı fonksiyon
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
}
