import React, { useState } from 'react';
import { Seat } from '../types';
import './SeatMap.css';

interface SeatMapProps {
    seats: Seat[];
    maxSelections: number;
    onSelectionChange: (selectedSeats: Seat[]) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, maxSelections, onSelectionChange }) => {
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

    // Organize seats by row
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
    }, {} as Record<number, Seat[]>);

    const rows = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'occupied') return;

        const isSelected = selectedSeats.some(s => s.id === seat.id);

        let newSelection: Seat[];
        if (isSelected) {
            newSelection = selectedSeats.filter(s => s.id !== seat.id);
        } else {
            if (selectedSeats.length >= maxSelections) {
                alert(`You can only select ${maxSelections} seat(s)`);
                return;
            }
            newSelection = [...selectedSeats, seat];
        }

        setSelectedSeats(newSelection);
        onSelectionChange(newSelection);
    };

    const getSeatClass = (seat: Seat) => {
        const isSelected = selectedSeats.some(s => s.id === seat.id);
        return `seat seat-${seat.type} seat-${isSelected ? 'selected' : seat.status}`;
    };

    return (
        <div className="seat-map">
            <div className="seat-map-header">
                <h3>Select Your Seats</h3>
                <div className="seat-legend">
                    <div className="legend-item">
                        <div className="seat seat-available"></div>
                        <span>Available</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-selected"></div>
                        <span>Selected</span>
                    </div>
                    <div className="legend-item">
                        <div className="seat seat-occupied"></div>
                        <span>Occupied</span>
                    </div>
                </div>
            </div>

            <div className="seat-map-container">
                <div className="seat-map-grid">
                    {rows.map(rowNum => (
                        <div key={rowNum} className="seat-row">
                            <div className="row-number">{rowNum}</div>
                            <div className="row-seats">
                                {seatsByRow[rowNum]
                                    .sort((a, b) => a.column.localeCompare(b.column))
                                    .map((seat, index) => (
                                        <React.Fragment key={seat.id}>
                                            <button
                                                className={getSeatClass(seat)}
                                                onClick={() => handleSeatClick(seat)}
                                                disabled={seat.status === 'occupied'}
                                                title={`Seat ${rowNum}${seat.column} - ${seat.type}`}
                                            >
                                                {seat.column}
                                            </button>
                                            {/* Add aisle space after column C */}
                                            {seat.column === 'C' && index < seatsByRow[rowNum].length - 1 && (
                                                <div className="aisle"></div>
                                            )}
                                        </React.Fragment>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="seat-selection-summary">
                <div className="summary-text">
                    Selected: <strong>{selectedSeats.length} / {maxSelections}</strong>
                    {selectedSeats.length > 0 && (
                        <span className="selected-seats-list">
                            {selectedSeats.map(s => `${s.row}${s.column}`).join(', ')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
