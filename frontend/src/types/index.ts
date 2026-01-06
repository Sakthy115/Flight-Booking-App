export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

export interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    airlineLogo: string;
    origin: Airport;
    destination: Airport;
    departureTime: string;
    arrivalTime: string;
    duration: number; // minutes
    price: number;
    currency: string;
    stops: number;
    layovers?: Airport[];
    availableSeats: number;
    class: 'economy' | 'business' | 'first';
}

export interface SearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    class: 'economy' | 'business' | 'first';
}

export interface Passenger {
    id: string;
    title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email?: string;
    phone?: string;
    passportNumber?: string;
    nationality?: string;
}

export interface Seat {
    id: string;
    row: number;
    column: string;
    type: 'window' | 'middle' | 'aisle';
    status: 'available' | 'occupied' | 'selected';
    price?: number; // extra charge for premium seats
}

export interface Booking {
    id: string;
    flightId: string;
    passengers: Passenger[];
    seats: Seat[];
    totalPrice: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    bookingReference: string;
    createdAt: string;
}

export interface PaymentInfo {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface PriceUpdate {
    flightId: string;
    newPrice: number;
    timestamp: string;
}
