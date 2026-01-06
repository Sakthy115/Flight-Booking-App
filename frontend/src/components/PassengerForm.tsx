import React, { useState } from 'react';
import { Passenger } from '../types';
import './PassengerForm.css';

interface PassengerFormProps {
    passengerCount: number;
    onSubmit: (passengers: Passenger[]) => void;
    onBack: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ passengerCount, onSubmit, onBack }) => {
    const [passengers, setPassengers] = useState<Passenger[]>(
        Array.from({ length: passengerCount }, (_, i) => ({
            id: `passenger-${i + 1}`,
            title: 'Mr' as const,
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: i === 0 ? '' : undefined,
            phone: i === 0 ? '' : undefined,
            passportNumber: '',
            nationality: '',
        }))
    );

    const handleChange = (index: number, field: keyof Passenger, value: string) => {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        setPassengers(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(passengers);
    };

    const isFormValid = () => {
        return passengers.every(p =>
            p.firstName && p.lastName && p.dateOfBirth && p.passportNumber
        ) && passengers[0].email && passengers[0].phone;
    };

    return (
        <form onSubmit={handleSubmit} className="passenger-form">
            <h2>Passenger Details</h2>
            <p className="text-secondary">Please provide information for all passengers</p>

            {passengers.map((passenger, index) => (
                <div key={passenger.id} className="passenger-section card">
                    <h3>Passenger {index + 1}</h3>

                    <div className="form-grid">
                        <div className="input-group">
                            <label className="input-label">Title</label>
                            <select
                                className="input"
                                value={passenger.title}
                                onChange={(e) => handleChange(index, 'title', e.target.value)}
                                required
                            >
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">First Name *</label>
                            <input
                                type="text"
                                className="input"
                                value={passenger.firstName}
                                onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Last Name *</label>
                            <input
                                type="text"
                                className="input"
                                value={passenger.lastName}
                                onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Date of Birth *</label>
                            <input
                                type="date"
                                className="input"
                                value={passenger.dateOfBirth}
                                onChange={(e) => handleChange(index, 'dateOfBirth', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Passport Number *</label>
                            <input
                                type="text"
                                className="input"
                                value={passenger.passportNumber || ''}
                                onChange={(e) => handleChange(index, 'passportNumber', e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Nationality</label>
                            <input
                                type="text"
                                className="input"
                                value={passenger.nationality || ''}
                                onChange={(e) => handleChange(index, 'nationality', e.target.value)}
                                placeholder="e.g., American"
                            />
                        </div>

                        {index === 0 && (
                            <>
                                <div className="input-group">
                                    <label className="input-label">Email *</label>
                                    <input
                                        type="email"
                                        className="input"
                                        value={passenger.email || ''}
                                        onChange={(e) => handleChange(index, 'email', e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Phone *</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        value={passenger.phone || ''}
                                        onChange={(e) => handleChange(index, 'phone', e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onBack}>
                    Back to Seats
                </button>
                <button type="submit" className="btn btn-primary" disabled={!isFormValid()}>
                    Continue to Payment
                </button>
            </div>
        </form>
    );
};

export default PassengerForm;
