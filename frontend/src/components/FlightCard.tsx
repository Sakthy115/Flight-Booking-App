import React from 'react';
import { Flight } from '../types';
import './FlightCard.css';

interface FlightCardProps {
    flight: Flight;
    onSelect: (flight: Flight) => void;
    isPriceUpdating?: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect, isPriceUpdating }) => {
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    return (
        <div className="flight-card card card-interactive animate-fade-in" onClick={() => onSelect(flight)}>
            <div className="flight-card-header">
                <div className="airline-info">
                    <div className="airline-logo">
                        {flight.airlineLogo ? (
                            <img src={flight.airlineLogo} alt={flight.airline} />
                        ) : (
                            <div className="airline-logo-placeholder">
                                {flight.airline.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="airline-name font-semibold">{flight.airline}</div>
                        <div className="flight-number text-sm text-secondary">{flight.flightNumber}</div>
                    </div>
                </div>

                <div className="flight-price">
                    <div className={`price ${isPriceUpdating ? 'price-updating' : ''}`}>
                        {formatPrice(flight.price, flight.currency)}
                    </div>
                    <div className="price-label text-sm text-secondary">per person</div>
                </div>
            </div>

            <div className="flight-route">
                <div className="route-point">
                    <div className="route-time font-semibold text-xl">{formatTime(flight.departureTime)}</div>
                    <div className="route-code text-lg">{flight.origin.code}</div>
                    <div className="route-city text-sm text-secondary">{flight.origin.city}</div>
                </div>

                <div className="route-middle">
                    <div className="route-duration text-sm text-secondary">{formatDuration(flight.duration)}</div>
                    <div className="route-line">
                        <div className="route-line-bar"></div>
                        <svg className="route-plane" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                    </div>
                    <div className="stops-info text-sm">
                        {flight.stops === 0 ? (
                            <span className="badge badge-success">Non-stop</span>
                        ) : (
                            <span className="badge badge-warning">{flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}</span>
                        )}
                    </div>
                </div>

                <div className="route-point">
                    <div className="route-time font-semibold text-xl">{formatTime(flight.arrivalTime)}</div>
                    <div className="route-code text-lg">{flight.destination.code}</div>
                    <div className="route-city text-sm text-secondary">{flight.destination.city}</div>
                </div>
            </div>

            <div className="flight-card-footer">
                <div className="flight-details">
                    <span className="text-sm text-secondary">
                        Class: <span className="font-medium text-capitalize">{flight.class}</span>
                    </span>
                    <span className="text-sm text-secondary">
                        Available: <span className="font-medium">{flight.availableSeats} seats</span>
                    </span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={(e) => {
                    e.stopPropagation();
                    onSelect(flight);
                }}>
                    Select Flight
                </button>
            </div>
        </div>
    );
};

export default FlightCard;
