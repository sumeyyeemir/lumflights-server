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
      return [];
    }

    return snapshot.docs.map((doc) => {
      const reservation = doc.data() as Reservation;
      return this.roleBasedDataService.filterReservationByRole(reservation, role);
    });
  }

  async generateAndSaveReservations(): Promise<{ success: boolean; count: number }> {
    const reservationsCollection = firestore.collection('reservations');
    const batch1 = firestore.batch(); 
    const batch2 = firestore.batch();
    const maxBatchSize = 500; // Firebase batch limit is 500 operations per batch
    const promises: Promise<void>[] = [];
  
    for (let i = 0; i < 1000; i++) {
      const promise = this.openaiService.generateReservation().then((reservation) => {
        const reservationRef = reservationsCollection.doc();
        if (i < maxBatchSize) {
          batch1.set(reservationRef, { ...reservation, id: reservationRef.id });
        } else {
          batch2.set(reservationRef, { ...reservation, id: reservationRef.id });
        }
      });
      promises.push(promise);
    }
  
    await Promise.all(promises);
  
    await batch1.commit();
    await batch2.commit();
  
    return {
      success: true,
      count: 1000,
    };
  }
}
