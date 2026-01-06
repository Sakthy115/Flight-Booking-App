package services

import (
	"flight-booking-backend/internal/models"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
)

type BookingService struct {
	mu       sync.RWMutex
	bookings map[string]*models.Booking
}

func NewBookingService() *BookingService {
	return &BookingService{
		bookings: make(map[string]*models.Booking),
	}
}

// CreateBooking creates a new flight booking
func (s *BookingService) CreateBooking(req models.BookingRequest) (*models.Booking, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Calculate total price
	totalPrice := 0.0
	for _, seat := range req.Seats {
		totalPrice += seat.Price
	}

	// Generate booking reference
	bookingRef := fmt.Sprintf("SKY%s", uuid.New().String()[:8])

	booking := &models.Booking{
		ID:               uuid.New().String(),
		FlightID:         req.FlightID,
		Passengers:       req.Passengers,
		Seats:            req.Seats,
		TotalPrice:       totalPrice,
		Currency:         "USD",
		Status:           "confirmed",
		BookingReference: bookingRef,
		CreatedAt:        time.Now(),
	}

	s.bookings[booking.ID] = booking

	return booking, nil
}

// GetBooking retrieves a booking by ID
func (s *BookingService) GetBooking(id string) (*models.Booking, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	booking, exists := s.bookings[id]
	if !exists {
		return nil, fmt.Errorf("booking not found")
	}

	return booking, nil
}

// CancelBooking cancels a booking
func (s *BookingService) CancelBooking(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	booking, exists := s.bookings[id]
	if !exists {
		return fmt.Errorf("booking not found")
	}

	booking.Status = "cancelled"
	return nil
}

// ProcessPayment simulates payment processing
func (s *BookingService) ProcessPayment(payment models.PaymentInfo, amount float64) (bool, error) {
	// Simulate payment processing delay
	time.Sleep(time.Millisecond * 500)

	// Mock validation - in real app, integrate with Stripe/PayPal
	if len(payment.CardNumber) < 13 {
		return false, fmt.Errorf("invalid card number")
	}

	return true, nil
}
