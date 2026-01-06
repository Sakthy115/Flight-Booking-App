package handlers

import (
	"flight-booking-backend/internal/models"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in development
	},
}

type WebSocketHandler struct {
	clients   map[*websocket.Conn]bool
	broadcast chan models.PriceUpdate
	mu        sync.RWMutex
}

func NewWebSocketHandler() *WebSocketHandler {
	handler := &WebSocketHandler{
		clients:   make(map[*websocket.Conn]bool),
		broadcast: make(chan models.PriceUpdate, 100),
	}

	// Start broadcasting price updates
	go handler.broadcastPriceUpdates()
	go handler.generateMockPriceUpdates()

	return handler
}

// HandleWebSocket handles WebSocket connections at /ws/prices
func (h *WebSocketHandler) HandleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	h.mu.Lock()
	h.clients[conn] = true
	h.mu.Unlock()

	log.Printf("New WebSocket client connected. Total clients: %d", len(h.clients))

	// Handle client disconnection
	defer func() {
		h.mu.Lock()
		delete(h.clients, conn)
		h.mu.Unlock()
		conn.Close()
		log.Printf("WebSocket client disconnected. Total clients: %d", len(h.clients))
	}()

	// Keep connection alive and handle incoming messages
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

// broadcastPriceUpdates sends price updates to all connected clients
func (h *WebSocketHandler) broadcastPriceUpdates() {
	for update := range h.broadcast {
		h.mu.RLock()
		for client := range h.clients {
			err := client.WriteJSON(update)
			if err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.Close()
				h.mu.Lock()
				delete(h.clients, client)
				h.mu.Unlock()
			}
		}
		h.mu.RUnlock()
	}
}

// generateMockPriceUpdates simulates real-time price changes
func (h *WebSocketHandler) generateMockPriceUpdates() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	flightIDs := []string{"flight-1", "flight-2", "flight-3", "flight-4", "flight-5"}

	for range ticker.C {
		// Only send updates if there are connected clients
		h.mu.RLock()
		hasClients := len(h.clients) > 0
		h.mu.RUnlock()

		if !hasClients {
			continue
		}

		// Generate random price update
		flightID := flightIDs[rand.Intn(len(flightIDs))]
		priceChange := (rand.Float64() - 0.5) * 50 // +/- $25
		newPrice := 400 + priceChange

		update := models.PriceUpdate{
			FlightID:  flightID,
			NewPrice:  newPrice,
			Timestamp: time.Now(),
		}

		select {
		case h.broadcast <- update:
		default:
			log.Println("Broadcast channel full, skipping update")
		}
	}
}
