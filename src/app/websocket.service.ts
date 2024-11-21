import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket!: WebSocket;
  reconnectInterval = 5000; // 5 seconds
  private reconnectTimer: any;

  connect(): void {
    this.socket = new WebSocket('ws://localhost:8080/ws?client-id=12341234134');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      // Clear the reconnect timer if the socket successfully opens
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
      }
    };

    this.socket.onmessage = (event) => {
      console.log('Message received from server:', event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socket.close();  // Ensure the socket is closed on error, triggering reconnect
    };
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection is not open');
    }
  }

  reconnect(): void {
    console.log(`Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`);
    // Try to reconnect after the specified interval
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  // Optional: You can provide a way to manually stop the reconnect attempts if needed
  stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
  }
}
