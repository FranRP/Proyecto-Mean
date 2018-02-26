import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicioService} from "../servicio.service";

@Component({
  selector: 'app-chatpartida',
  templateUrl: './chatpartida.component.html',
  styleUrls: ['./chatpartida.component.css']
})
export class ChatpartidaComponent implements OnInit, OnDestroy {
  listaUsers = [];
  message: string;
  arrayMensajes = [];
  uno: any;
  dos: any;
  private id;

  constructor(private union: ServicioService) {
  }

  ngOnInit() {
    this.id = Math.random();
    this.uno = this.union.getSala().subscribe(data => {
      this.listaUsers = data.usuario;
    });
    this.dos = this.union.getMensajeSala().subscribe(data => {
      console.log('SUSCRIPCION partida con ID=' + this.id + ' recibe ' + data);
      this.arrayMensajes.push(data);
    });
  }

  ngOnDestroy() {

    this.uno.unsubscribe();
    this.dos.unsubscribe();
  }

  sendMessage() {
    console.log(this.arrayMensajes);
    this.union.sendMensajeSala(this.message);
    console.log('chat partida con ID=' + this.id + ' envia ' + this.message);
    this.message = '';
  }

}
