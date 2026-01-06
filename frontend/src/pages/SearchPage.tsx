import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import SeatMap from '../components/SeatMap';
import PassengerForm from '../components/PassengerForm';
import PaymentForm from '../components/PaymentForm';
import { Flight, SearchParams, Seat, Passenger, PaymentInfo, PriceUpdate } from '../types';
import { flightAPI, bookingAPI, seatAPI } from '../services/api';
import { usePriceUpdates } from '../hooks/usePriceUpdates';
import './SearchPage.css';

type BookingStep = 'search' | 'select-flight' | 'select-seats' | 'passenger-details' | 'payment' | 'confirmation';

const SearchPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<BookingStep>('search');
    const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [bookingId, setBookingId] = useState<string>('');
    const [flights, setFlights] = useState<Flight[]>([]);

    // Handle real-time price updates
    usePriceUpdates((update: PriceUpdate) => {
        setFlights(prev => prev.map(flight =>
            flight.id === update.flightId
                ? { ...flight, price: update.newPrice }
                : flight
        ));
    });

    // Search flights mutation
    const searchMutation = useMutation({
        mutationFn: flightAPI.searchFlights,
        onSuccess: (data) => {
            setFlights(data);
            setCurrentStep('select-flight');
        },
    });

    // Get seats query
    const { data: availableSeats = [] } = useQuery({
        queryKey: ['seats', selectedFlight?.id],
        queryFn: () => seatAPI.getAvailableSeats(selectedFlight!.id),
        enabled: !!selectedFlight && currentStep === 'select-seats',
    });

    // Create booking mutation
    const bookingMutation = useMutation({
        mutationFn: ({ flightId, passengers, seats, payment }: {
            flightId: string;
            passengers: Passenger[];
            seats: Seat[];
            payment: PaymentInfo;
        }) => bookingAPI.createBooking(flightId, passengers, seats, payment),
        onSuccess: (data) => {
            setBookingId(data.id);
            setCurrentStep('confirmation');
        },
    });

    const handleSearch = (params: SearchParams) => {
        setSearchParams(params);
        searchMutation.mutate(params);
    };

    const handleFlightSelect = (flight: Flight) => {
        setSelectedFlight(flight);
        setCurrentStep('select-seats');
    };

    const handleSeatsConfirm = () => {
        if (selectedSeats.length === searchParams?.passengers) {
            setCurrentStep('passenger-details');
        } else {
            alert(`Please select ${searchParams?.passengers} seat(s)`);
        }
    };

    const handlePassengersSubmit = (passengerData: Passenger[]) => {
        setPassengers(passengerData);
        setCurrentStep('payment');
    };

    const handlePaymentSubmit = (payment: PaymentInfo) => {
        if (selectedFlight && passengers.length > 0 && selectedSeats.length > 0) {
            bookingMutation.mutate({
                flightId: selectedFlight.id,
                passengers,
                seats: selectedSeats,
                payment,
            });
        }
    };

    const calculateTotal = () => {
        if (!selectedFlight) return 0;
        const flightTotal = selectedFlight.price * (searchParams?.passengers || 1);
        const seatTotal = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);
        return flightTotal + seatTotal;
    };

    return (
        <div className="search-page">
            {/* Hero Section */}
            {currentStep === 'search' && (
                <div className="hero-section">
                    <div className="container">
                        <h1 className="hero-title">Find Your Perfect Flight</h1>
                        <p className="hero-subtitle">Search thousands of flights with real-time pricing</p>
                        <SearchForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
                    </div>
                </div>
            )}

            {/* Flight Results */}
            {currentStep === 'select-flight' && (
                <div className="container">
                    <div className="page-header">
                        <h2>Available Flights</h2>
                        <p className="text-secondary">{flights.length} flights found</p>
                    </div>
                    <div className="flights-list">
                        {flights.map(flight => (
                            <FlightCard
                                key={flight.id}
                                flight={flight}
                                onSelect={handleFlightSelect}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Seat Selection */}
            {currentStep === 'select-seats' && selectedFlight && (
                <div className="container">
                    <div className="page-header">
                        <h2>Select Your Seats</h2>
                        <p className="text-secondary">
                            {selectedFlight.airline} {selectedFlight.flightNumber} -
                            {selectedFlight.origin.code} → {selectedFlight.destination.code}
                        </p>
                    </div>
                    <SeatMap
                        seats={availableSeats}
                        maxSelections={searchParams?.passengers || 1}
                        onSelectionChange={setSelectedSeats}
                    />
                    <div className="step-actions">
                        <button className="btn btn-secondary" onClick={() => setCurrentStep('select-flight')}>
                            Back to Flights
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSeatsConfirm}
                            disabled={selectedSeats.length !== searchParams?.passengers}
                        >
                            Continue to Passenger Details
                        </button>
                    </div>
                </div>
            )}

            {/* Passenger Details */}
            {currentStep === 'passenger-details' && (
                <div className="container">
                    <PassengerForm
                        passengerCount={searchParams?.passengers || 1}
                        onSubmit={handlePassengersSubmit}
                        onBack={() => setCurrentStep('select-seats')}
                    />
                </div>
            )}

            {/* Payment */}
            {currentStep === 'payment' && selectedFlight && (
                <div className="container">
                    <PaymentForm
                        totalAmount={calculateTotal()}
                        currency={selectedFlight.currency}
                        onSubmit={handlePaymentSubmit}
                        onBack={() => setCurrentStep('passenger-details')}
                        isProcessing={bookingMutation.isPending}
                    />
                </div>
            )}

            {/* Confirmation */}
            {currentStep === 'confirmation' && selectedFlight && (
                <div className="container">
                    <div className="confirmation-card card">
                        <div className="confirmation-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h1>Booking Confirmed!</h1>
                        <p className="confirmation-reference">
                            Booking Reference: <strong>{bookingId}</strong>
                        </p>
                        <div className="confirmation-details">
                            <h3>Flight Details</h3>
                            <p>{selectedFlight.airline} {selectedFlight.flightNumber}</p>
                            <p>{selectedFlight.origin.city} → {selectedFlight.destination.city}</p>
                            <p>Passengers: {passengers.length}</p>
                            <p>Seats: {selectedSeats.map(s => `${s.row}${s.column}`).join(', ')}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                            setCurrentStep('search');
                            setSelectedFlight(null);
                            setSelectedSeats([]);
                            setPassengers([]);
                            setFlights([]);
                        }}>
                            Book Another Flight
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
