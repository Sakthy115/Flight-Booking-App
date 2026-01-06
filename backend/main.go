package main

import (
	"flight-booking-backend/internal/router"
	"log"
)

func main() {
	// Setup router
	r := router.SetupRouter()

	// Start server
	log.Println("🚀 Flight Booking API starting on :8080")
	log.Println("📡 WebSocket endpoint: ws://localhost:8080/ws/prices")
	log.Println("🔗 API endpoints: http://localhost:8080/api")

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
