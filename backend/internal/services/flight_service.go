package services

import (
	"flight-booking-backend/internal/models"
	"fmt"
	"math/rand"
	"sync"
	"time"

	"github.com/google/uuid"
)

type FlightService struct {
	mu sync.RWMutex
}

func NewFlightService() *FlightService {
	return &FlightService{}
}

// Mock GDS sources
var mockGDSSources = []string{"Amadeus", "Sabre", "Travelport"}

// SearchFlights simulates concurrent API calls to multiple GDS systems
func (s *FlightService) SearchFlights(params models.SearchParams) ([]models.Flight, error) {
	var wg sync.WaitGroup
	flightsChan := make(chan []models.Flight, len(mockGDSSources))

	// Spawn goroutines for each GDS source
	for _, source := range mockGDSSources {
		wg.Add(1)
		go func(gds string) {
			defer wg.Done()
			flights := s.queryGDS(gds, params)
			flightsChan <- flights
		}(source)
	}

	// Wait for all goroutines to complete
	go func() {
		wg.Wait()
		close(flightsChan)
	}()

	// Aggregate results
	var allFlights []models.Flight
	for flights := range flightsChan {
		allFlights = append(allFlights, flights...)
	}

	return allFlights, nil
}

// queryGDS simulates querying a GDS system
func (s *FlightService) queryGDS(gds string, params models.SearchParams) []models.Flight {
	// Simulate network latency
	time.Sleep(time.Millisecond * time.Duration(100+rand.Intn(200)))

	airlines := []string{"United Airlines", "Delta", "American Airlines", "Emirates", "Lufthansa", "British Airways"}
	numFlights := 2 + rand.Intn(3) // 2-4 flights per GDS

	flights := make([]models.Flight, numFlights)
	departureDate, _ := time.Parse("2006-01-02", params.DepartureDate)

	for i := 0; i < numFlights; i++ {
		airline := airlines[rand.Intn(len(airlines))]
		departureTime := departureDate.Add(time.Hour * time.Duration(6+i*3+rand.Intn(3)))
		duration := 120 + rand.Intn(300) // 2-7 hours
		arrivalTime := departureTime.Add(time.Minute * time.Duration(duration))

		flights[i] = models.Flight{
			ID:           uuid.New().String(),
			FlightNumber: fmt.Sprintf("%s%d", airline[:2], 1000+rand.Intn(9000)),
			Airline:      airline,
			AirlineLogo:  "", // Could add actual logos
			Origin: models.Airport{
				Code:    params.Origin,
				Name:    fmt.Sprintf("%s International Airport", params.Origin),
				City:    params.Origin,
				Country: "USA",
			},
			Destination: models.Airport{
				Code:    params.Destination,
				Name:    fmt.Sprintf("%s International Airport", params.Destination),
				City:    params.Destination,
				Country: "USA",
			},
			DepartureTime:  departureTime,
			ArrivalTime:    arrivalTime,
			Duration:       duration,
			Price:          float64(200 + rand.Intn(800)),
			Currency:       "USD",
			Stops:          rand.Intn(3), // 0-2 stops
			AvailableSeats: 50 + rand.Intn(150),
			Class:          params.Class,
		}
	}

	return flights
}

// GetFlightByID retrieves a flight by ID (mock implementation)
func (s *FlightService) GetFlightByID(id string) (*models.Flight, error) {
	// In a real app, this would query a database
	// For now, return a mock flight
	return &models.Flight{
		ID:           id,
		FlightNumber: "UA1234",
		Airline:      "United Airlines",
		Origin: models.Airport{
			Code: "JFK",
			Name: "John F. Kennedy International Airport",
			City: "New York",
			Country: "USA",
		},
		Destination: models.Airport{
			Code: "LAX",
			Name: "Los Angeles International Airport",
			City: "Los Angeles",
			Country: "USA",
		},
		DepartureTime:  time.Now().Add(24 * time.Hour),
		ArrivalTime:    time.Now().Add(30 * time.Hour),
		Duration:       360,
		Price:          450.00,
		Currency:       "USD",
		Stops:          0,
		AvailableSeats: 120,
		Class:          "economy",
	}, nil
}

// GenerateMockSeats creates a mock seat map for a flight
func (s *FlightService) GenerateMockSeats(flightID string) []models.Seat {
	seats := []models.Seat{}
	rows := 30
	columns := []string{"A", "B", "C", "D", "E", "F"}

	for row := 1; row <= rows; row++ {
		for _, col := range columns {
			seatType := "middle"
			if col == "A" || col == "F" {
				seatType = "window"
			} else if col == "C" || col == "D" {
				seatType = "aisle"
			}

			status := "available"
			if rand.Float32() < 0.3 { // 30% occupied
				status = "occupied"
			}

			seats = append(seats, models.Seat{
				ID:     fmt.Sprintf("%s-%d%s", flightID, row, col),
				Row:    row,
				Column: col,
				Type:   seatType,
				Status: status,
				Price:  0, // Free seat selection for economy
			})
		}
	}

	return seats
}
