import {Component, OnInit} from '@angular/core';
import {ServicioService} from "../servicio.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  nombre: string;


  constructor(private union: ServicioService) {
  }

  ngOnInit() {
    this.nombre = this.union.usuario;
    this.union.sendUsuario(this.nombre);
    this.union.sendEntroMenu();
  }


  iniciar() {
    this.union.sendUsuarioGame();
    this.union.sendPartida();
  }


}
