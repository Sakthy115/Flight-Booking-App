import React, { useState } from 'react';
import { SearchParams } from '../types';

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
    isLoading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
    const [formData, setFormData] = useState<SearchParams>({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: 1,
        class: 'economy',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(formData);
    };

    const handleChange = (field: keyof SearchParams, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-form-grid">
                <div className="input-group">
                    <label htmlFor="origin" className="input-label">From</label>
                    <input
                        id="origin"
                        type="text"
                        className="input"
                        placeholder="JFK - New York"
                        value={formData.origin}
                        onChange={(e) => handleChange('origin', e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="destination" className="input-label">To</label>
                    <input
                        id="destination"
                        type="text"
                        className="input"
                        placeholder="LAX - Los Angeles"
                        value={formData.destination}
                        onChange={(e) => handleChange('destination', e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="departureDate" className="input-label">Departure</label>
                    <input
                        id="departureDate"
                        type="date"
                        className="input"
                        value={formData.departureDate}
                        onChange={(e) => handleChange('departureDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="returnDate" className="input-label">Return (Optional)</label>
                    <input
                        id="returnDate"
                        type="date"
                        className="input"
                        value={formData.returnDate}
                        onChange={(e) => handleChange('returnDate', e.target.value)}
                        min={formData.departureDate || new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="passengers" className="input-label">Passengers</label>
                    <select
                        id="passengers"
                        className="input"
                        value={formData.passengers}
                        onChange={(e) => handleChange('passengers', parseInt(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="class" className="input-label">Class</label>
                    <select
                        id="class"
                        className="input"
                        value={formData.class}
                        onChange={(e) => handleChange('class', e.target.value as 'economy' | 'business' | 'first')}
                    >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                        Searching...
                    </>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                        Search Flights
                    </>
                )}
            </button>
        </form>
    );
};

export default SearchForm;
