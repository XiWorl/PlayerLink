const http = require("http")
const app = require("./api/server")
const { initializeWebSocketServer } = require("./messages/websocket")
const PORT = process.env.PORT || 3000

// Create HTTP server using the Express app
const httpServer = http.createServer(app)

// Initialize WebSocket server
initializeWebSocketServer(httpServer)

// Start the server
httpServer.listen(PORT, () => {
	console.log(`HTTP Server running at http://localhost:${PORT}`)
	console.log(`WebSocket Server initialized`)
})
