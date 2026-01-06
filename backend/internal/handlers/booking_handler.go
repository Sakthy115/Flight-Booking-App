package handlers

import (
	"flight-booking-backend/internal/models"
	"flight-booking-backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BookingHandler struct {
	bookingService *services.BookingService
}

func NewBookingHandler(bookingService *services.BookingService) *BookingHandler {
	return &BookingHandler{
		bookingService: bookingService,
	}
}

// CreateBooking handles POST /api/bookings
func (h *BookingHandler) CreateBooking(c *gin.Context) {
	var req models.BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Process payment
	success, err := h.bookingService.ProcessPayment(req.Payment, 0)
	if err != nil || !success {
		c.JSON(http.StatusPaymentRequired, gin.H{"error": "Payment failed"})
		return
	}

	// Create booking
	booking, err := h.bookingService.CreateBooking(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusCreated, booking)
}

// GetBooking handles GET /api/bookings/:id
func (h *BookingHandler) GetBooking(c *gin.Context) {
	id := c.Param("id")

	booking, err := h.bookingService.GetBooking(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// CancelBooking handles DELETE /api/bookings/:id
func (h *BookingHandler) CancelBooking(c *gin.Context) {
	id := c.Param("id")

	err := h.bookingService.CancelBooking(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking cancelled successfully"})
}
