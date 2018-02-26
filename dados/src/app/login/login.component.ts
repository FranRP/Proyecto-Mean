import {Component, OnInit} from '@angular/core';
import {ServicioService} from "../servicio.service";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nickname: string = "";
  comprobador: string;

  constructor(private union: ServicioService) {
  }

  ngOnInit() {
    this.union.getArrayNombres().subscribe(data => {
      console.log(data);
      this.comprobador = data;
      if (this.comprobador == 'no') {
        $('.no-disponible').css('display', 'block');
        $('.no-disponible p').css('color', 'red');
        $('.no-disponible p').text('Nombre no disponible');
      } else if (this.comprobador == 'vacio') {
        $('.no-disponible').css('display', 'block');
        $('.no-disponible p').css('color', 'red');
        $('.no-disponible p').text('Debes introducir un nombre');
      } else {
        $('.no-disponible').css('display', 'block');
        $('.no-disponible p').css('color', 'green');
        $('.no-disponible p').text('Nombre disponible, accede al juego');
        $('.entrar').attr('disabled', false);
        $('.poner-name').attr('disabled', true);
        $('.comprobador').attr('disabled', true);
      }
    });
  }

  acceder() {
    this.union.usuario = this.nickname;
    this.nickname = '';
  }

  comprobar() {
    this.union.sendComprobador(this.nickname);
  }

}
