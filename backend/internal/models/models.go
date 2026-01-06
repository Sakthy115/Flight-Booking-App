package models

import "time"

type Airport struct {
	Code    string `json:"code"`
	Name    string `json:"name"`
	City    string `json:"city"`
	Country string `json:"country"`
}

type Flight struct {
	ID             string    `json:"id"`
	FlightNumber   string    `json:"flightNumber"`
	Airline        string    `json:"airline"`
	AirlineLogo    string    `json:"airlineLogo"`
	Origin         Airport   `json:"origin"`
	Destination    Airport   `json:"destination"`
	DepartureTime  time.Time `json:"departureTime"`
	ArrivalTime    time.Time `json:"arrivalTime"`
	Duration       int       `json:"duration"` // minutes
	Price          float64   `json:"price"`
	Currency       string    `json:"currency"`
	Stops          int       `json:"stops"`
	Layovers       []Airport `json:"layovers,omitempty"`
	AvailableSeats int       `json:"availableSeats"`
	Class          string    `json:"class"` // economy, business, first
}

type SearchParams struct {
	Origin        string `json:"origin" binding:"required"`
	Destination   string `json:"destination" binding:"required"`
	DepartureDate string `json:"departureDate" binding:"required"`
	ReturnDate    string `json:"returnDate"`
	Passengers    int    `json:"passengers" binding:"required,min=1"`
	Class         string `json:"class" binding:"required"`
}

type Passenger struct {
	ID             string `json:"id"`
	Title          string `json:"title"`
	FirstName      string `json:"firstName" binding:"required"`
	LastName       string `json:"lastName" binding:"required"`
	DateOfBirth    string `json:"dateOfBirth" binding:"required"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
	PassportNumber string `json:"passportNumber"`
	Nationality    string `json:"nationality"`
}

type Seat struct {
	ID     string  `json:"id"`
	Row    int     `json:"row"`
	Column string  `json:"column"`
	Type   string  `json:"type"` // window, middle, aisle
	Status string  `json:"status"` // available, occupied, selected
	Price  float64 `json:"price,omitempty"`
}

type Booking struct {
	ID               string      `json:"id"`
	FlightID         string      `json:"flightId"`
	Passengers       []Passenger `json:"passengers"`
	Seats            []Seat      `json:"seats"`
	TotalPrice       float64     `json:"totalPrice"`
	Currency         string      `json:"currency"`
	Status           string      `json:"status"` // pending, confirmed, cancelled
	BookingReference string      `json:"bookingReference"`
	CreatedAt        time.Time   `json:"createdAt"`
}

type PaymentInfo struct {
	CardNumber     string         `json:"cardNumber"`
	CardHolder     string         `json:"cardHolder"`
	ExpiryDate     string         `json:"expiryDate"`
	CVV            string         `json:"cvv"`
	BillingAddress BillingAddress `json:"billingAddress"`
}

type BillingAddress struct {
	Street  string `json:"street"`
	City    string `json:"city"`
	State   string `json:"state"`
	ZipCode string `json:"zipCode"`
	Country string `json:"country"`
}

type BookingRequest struct {
	FlightID   string      `json:"flightId" binding:"required"`
	Passengers []Passenger `json:"passengers" binding:"required"`
	Seats      []Seat      `json:"seats" binding:"required"`
	Payment    PaymentInfo `json:"payment" binding:"required"`
}

type PriceUpdate struct {
	FlightID  string    `json:"flightId"`
	NewPrice  float64   `json:"newPrice"`
	Timestamp time.Time `json:"timestamp"`
}
