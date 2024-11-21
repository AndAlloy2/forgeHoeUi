import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import {WebsocketService} from "./websocket.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, FormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'forgehomeui';
  elements = [{id: 254, name: "Smoke Detector", backClass: ""}, {id: 782, name: "Temperature Sensor", backClass: ""}, {id: 274, name: "Smoke Detector", backClass: ""}]
  elements2 = [{id: 737, name: "Water Detector", backClass: ""}, {id: 369, name: "Magnet Detector", backClass: ""}, {id: 34, name: "Water Detector", backClass: ""}]

  serverMessage: string | null = null;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.websocketService.connect();

    // Listen to incoming messages from the server
    this.websocketService.socket.onmessage = (event) => {
      console.log('Message received from server:', event.data);
      if (event.data.startsWith('From pico to angular 12341234134: Looks')) {
        let tempSens = this.elements.find(dev => dev.name === "Temperature Sensor")
        if (tempSens) {
          tempSens.backClass = 'low-temp'
          // setTimeout(() => {
          //   tempSens.backClass = ''
          // }, 3500)
        }
      } else  {
        let tempSens = this.elements.find(dev => dev.name === "Temperature Sensor")
        if (tempSens) {
          tempSens.backClass = ''
        }
      }
      this.serverMessage = event.data;  // Update server message display
    };
  }

  sendMessage(): void {
    this.websocketService.sendMessage('Hello from Angular');
    let tempSens = this.elements.find(dev => dev.name === "Temperature Sensor")
    if (tempSens) {
      tempSens.backClass = ''
    }
  }

}
