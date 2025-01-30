import { Injectable } from '@nestjs/common';
import { Reservation } from '../../reservations/models/reservation.model';

@Injectable()
export class RoleBasedDataService {
  filterReservationByRole(reservation: Reservation, role: 'admin' | 'staff'): Partial<Reservation> {
    if (role === 'staff') {
      return {
        flightNumber: reservation.flightNumber,
        departure: reservation.departure,
        arrival: reservation.arrival,
        date: reservation.date,
      };
    }
    return reservation;
  }
}