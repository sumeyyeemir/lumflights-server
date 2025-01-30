export interface Reservation {
    id: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    date: string;
    passengers: Passenger[];
    comments: string[];
  }
  
  export interface Passenger {
    id: string;
    name: string;
    age: number;
    seatNumber: string;
  }
  
  