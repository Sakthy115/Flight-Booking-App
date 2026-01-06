package handlers

import (
	"flight-booking-backend/internal/models"
	"flight-booking-backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FlightHandler struct {
	flightService *services.FlightService
}

func NewFlightHandler(flightService *services.FlightService) *FlightHandler {
	return &FlightHandler{
		flightService: flightService,
	}
}

// SearchFlights handles POST /api/flights/search
func (h *FlightHandler) SearchFlights(c *gin.Context) {
	var params models.SearchParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	flights, err := h.flightService.SearchFlights(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search flights"})
		return
	}

	c.JSON(http.StatusOK, flights)
}

// GetFlight handles GET /api/flights/:id
func (h *FlightHandler) GetFlight(c *gin.Context) {
	id := c.Param("id")

	flight, err := h.flightService.GetFlightByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flight not found"})
		return
	}

	c.JSON(http.StatusOK, flight)
}

// GetSeats handles GET /api/flights/:id/seats
func (h *FlightHandler) GetSeats(c *gin.Context) {
	flightID := c.Param("id")

	seats := h.flightService.GenerateMockSeats(flightID)
	c.JSON(http.StatusOK, seats)
}
