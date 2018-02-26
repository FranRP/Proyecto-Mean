import {Component, OnInit} from '@angular/core';
import {ServicioService} from "../servicio.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string;
  arrayMensajes = [];
  name: string;


  constructor(private union: ServicioService) {
  }

  ngOnInit() {
    this.name = this.union.usuario;
    this.union.getMessage().subscribe(data => {
      console.log(data);
      this.arrayMensajes.push(data);
    });
  }

  sendMessage() {
    this.union.sendMessage({"nombre": this.name, "mensaje": this.message});
    this.message = '';
  }

}
