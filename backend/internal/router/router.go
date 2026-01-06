package router

import (
	"flight-booking-backend/internal/handlers"
	"flight-booking-backend/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Initialize services
	flightService := services.NewFlightService()
	bookingService := services.NewBookingService()

	// Initialize handlers
	flightHandler := handlers.NewFlightHandler(flightService)
	bookingHandler := handlers.NewBookingHandler(bookingService)
	wsHandler := handlers.NewWebSocketHandler()

	// API routes
	api := r.Group("/api")
	{
		// Flight routes
		flights := api.Group("/flights")
		{
			flights.POST("/search", flightHandler.SearchFlights)
			flights.GET("/:id", flightHandler.GetFlight)
			flights.GET("/:id/seats", flightHandler.GetSeats)
		}

		// Booking routes
		bookings := api.Group("/bookings")
		{
			bookings.POST("", bookingHandler.CreateBooking)
			bookings.GET("/:id", bookingHandler.GetBooking)
			bookings.DELETE("/:id", bookingHandler.CancelBooking)
		}
	}

	// WebSocket route
	r.GET("/ws/prices", wsHandler.HandleWebSocket)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	return r
}
