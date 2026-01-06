import { SearchParams, Flight, Booking, Passenger, Seat, PaymentInfo } from '../types';

const API_BASE_URL = '/api';

export const flightAPI = {
    searchFlights: async (params: SearchParams): Promise<Flight[]> => {
        const response = await fetch(`${API_BASE_URL}/flights/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error('Failed to search flights');
        }

        return response.json();
    },

    getFlightById: async (id: string): Promise<Flight> => {
        const response = await fetch(`${API_BASE_URL}/flights/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch flight');
        }

        return response.json();
    },
};

export const bookingAPI = {
    createBooking: async (
        flightId: string,
        passengers: Passenger[],
        seats: Seat[],
        payment: PaymentInfo
    ): Promise<Booking> => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flightId,
                passengers,
                seats,
                payment,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }

        return response.json();
    },

    getBooking: async (id: string): Promise<Booking> => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch booking');
        }

        return response.json();
    },

    cancelBooking: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }
    },
};

export const seatAPI = {
    getAvailableSeats: async (flightId: string): Promise<Seat[]> => {
        const response = await fetch(`${API_BASE_URL}/flights/${flightId}/seats`);

        if (!response.ok) {
            throw new Error('Failed to fetch seats');
        }

        return response.json();
    },
};
