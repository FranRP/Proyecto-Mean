import {Component} from '@angular/core';
import {ServicioService} from "./servicio.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  message: string = 'hola';

  constructor(private union: ServicioService) {
  }

  sendMessage() {
    this.union.sendMessage(this.message);
  }
}
