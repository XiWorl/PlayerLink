import { io } from "socket.io-client"
import {
	sendMessage,
	markMessageAsRead,
	markAllMessagesAsRead,
	getConversation,
	getConversations,
	getUnreadCount,
} from "../api"

class MessageService {
	constructor() {
		this.socket = null
		this.connected = false
		this.listeners = {
			newMessage: [],
			messageRead: [],
			messagesRead: [],
			userStatus: [],
			error: [],
			conversationHistory: [],
			conversationsList: [],
		}
	}

	/**
	 * Connect to the WebSocket server
	 * @param {string} token - JWT authentication token
	 * @returns {Promise} - Resolves when connected, rejects on error
	 */
	connect(token) {
		return new Promise((resolve, reject) => {
			if (this.connected) {
				resolve()
				return
			}

			// Connect to the WebSocket server
			this.socket = io("http://localhost:3000", {
				auth: { token },
			})

			// Set up event listeners
			this.socket.on("connect", () => {
				console.log("Connected to WebSocket server")
				this.connected = true
				resolve()
			})

			this.socket.on("connect_error", (error) => {
				console.error("WebSocket connection error:", error)
				reject(error)
			})

			this.socket.on("disconnect", () => {
				console.log("Disconnected from WebSocket server")
				this.connected = false
			})

			// Set up message event listeners
			this.socket.on("new_message", (message) => {
				this._notifyListeners("newMessage", message)
			})

			this.socket.on("message_read", (data) => {
				this._notifyListeners("messageRead", data)
			})

			this.socket.on("messages_read", (data) => {
				this._notifyListeners("messagesRead", data)
			})

			this.socket.on("user_status", (data) => {
				this._notifyListeners("userStatus", data)
			})

			this.socket.on("error", (error) => {
				console.error("WebSocket error:", error)
				this._notifyListeners("error", error)
			})

			this.socket.on("conversation_history", (data) => {
				this._notifyListeners("conversationHistory", data)
			})

			this.socket.on("conversations_list", (data) => {
				this._notifyListeners("conversationsList", data)
			})
		})
	}

	/**
	 * Disconnect from the WebSocket server
	 */
	disconnect() {
		if (this.socket) {
			this.socket.disconnect()
			this.socket = null
			this.connected = false
		}
	}

	/**
	 * Send a message to another user
	 * @param {number} receiverId - ID of the user to send the message to
	 * @param {string} content - Content of the message
	 * @returns {Promise} - Resolves with the sent message, rejects on error
	 */
	sendMessageToUser(receiverId, content) {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				// If not connected via WebSocket, use REST API
				sendMessage(receiverId, content)
					.then((message) => resolve(message))
					.catch((error) => reject(error))
				return
			}

			// Set up a one-time listener for the message_sent event
			this.socket.once("message_sent", (message) => {
				resolve(message)
			})

			// Set up a one-time listener for the error event
			this.socket.once("error", (error) => {
				reject(error)
			})

			// Send the message
			this.socket.emit("send_message", { receiverId, content })
		})
	}

	/**
	 * Mark a message as read
	 * @param {number} messageId - ID of the message to mark as read
	 * @returns {Promise} - Resolves when the message is marked as read, rejects on error
	 */
	markMessageRead(messageId) {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				// If not connected via WebSocket, use REST API
				markMessageAsRead(messageId)
					.then((message) => resolve(message))
					.catch((error) => reject(error))
				return
			}

			// Send the mark_as_read event
			this.socket.emit("mark_as_read", { messageId })
			resolve()
		})
	}

	/**
	 * Mark all messages in a conversation as read
	 * @param {number} userId - ID of the other user in the conversation
	 * @returns {Promise} - Resolves when the messages are marked as read, rejects on error
	 */
	markAllMessagesRead(userId) {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				// If not connected via WebSocket, use REST API
				markAllMessagesAsRead(userId)
					.then((result) => resolve(result))
					.catch((error) => reject(error))
				return
			}

			// For WebSocket, we'll mark messages as read when getting conversation history
			this.getConversationWithUser(userId)
				.then(() => resolve())
				.catch((error) => reject(error))
		})
	}

	/**
	 * Get conversation history with another user
	 * @param {number} userId - ID of the other user in the conversation
	 * @returns {Promise} - Resolves with the conversation history, rejects on error
	 */
	getConversationWithUser(userId) {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				// If not connected via WebSocket, use REST API
				getConversation(userId)
					.then((messages) => resolve(messages))
					.catch((error) => reject(error))
				return
			}

			// Set up a one-time listener for the conversation_history event
			this.socket.once("conversation_history", (data) => {
				if (data.userId === userId) {
					resolve(data.messages)
				} else {
					reject(new Error("Received conversation history for wrong user"))
				}
			})

			// Set up a one-time listener for the error event
			this.socket.once("error", (error) => {
				reject(error)
			})

			// Get the conversation history
			this.socket.emit("get_conversation", { otherUserId: userId })
		})
	}

	/**
	 * Get all conversations for the current user
	 * @returns {Promise} - Resolves with the list of conversations, rejects on error
	 */
	getAllConversations() {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				// If not connected via WebSocket, use REST API
				getConversations()
					.then((conversations) => resolve(conversations))
					.catch((error) => reject(error))
				return
			}

			// Set up a one-time listener for the conversations_list event
			this.socket.once("conversations_list", (conversations) => {
				resolve(conversations)
			})

			// Set up a one-time listener for the error event
			this.socket.once("error", (error) => {
				reject(error)
			})

			// Get the conversations list
			this.socket.emit("get_conversations")
		})
	}

	/**
	 * Get the number of unread messages for the current user
	 * @returns {Promise} - Resolves with the number of unread messages, rejects on error
	 */
	getUnreadMessageCount() {
		return getUnreadCount().catch((error) => {
			console.error("Error getting unread count:", error)
			return 0
		})
	}

	/**
	 * Add an event listener
	 * @param {string} event - Event name
	 * @param {function} callback - Callback function
	 */
	addEventListener(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = []
		}
		this.listeners[event].push(callback)
	}

	/**
	 * Remove an event listener
	 * @param {string} event - Event name
	 * @param {function} callback - Callback function
	 */
	removeEventListener(event, callback) {
		if (!this.listeners[event]) {
			return
		}
		this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
	}

	/**
	 * Notify all listeners of an event
	 * @param {string} event - Event name
	 * @param {*} data - Event data
	 * @private
	 */
	_notifyListeners(event, data) {
		if (!this.listeners[event]) {
			return
		}
		this.listeners[event].forEach((callback) => {
			try {
				callback(data)
			} catch (error) {
				console.error(`Error in ${event} listener:`, error)
			}
		})
	}
}

// Create a singleton instance
const messageService = new MessageService()

export default messageService
