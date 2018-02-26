import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicioService} from "../servicio.service";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  nombre: string;
  posibles = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
  dadouno: any;
  dadodos: any;
  total: any;
  comienzo: string;
  totalgame: any;
  menuadivina: string = 'off';
  reset: string = 'resetearOff';
  ganador: string;
  resultados = [];
  cancelar: string;

  titulo: string = 'Debes esperar al resto de jugadores para jugar';

  uno: any;
  dos: any;
  tres: any;
  cuatro: any;
  cinco: any;
  seis: any;


  constructor(private union: ServicioService) {

  }


  ngOnInit() {
    this.nombre = this.union.usuario;
    this.uno = this.union.getAviso().subscribe(data => {
      this.comienzo = data;
      if (this.comienzo == 'activar') {
        this.titulo = '¡Jugadores listos, ya puedes jugar!'
      }
    });
    this.dos = this.union.getAdivinanza().subscribe(data => {
      this.totalgame = data.value;
      this.menuadivina = data.estado;
    });
    this.tres = this.union.getGanadorRonda().subscribe(data => {
      console.log(data);
      if (data[0].user == this.nombre) {
        this.union.sendSumaScore();
      }
      this.resultados.push(data[0]);
    });

    this.cuatro = this.union.getReset().subscribe(data => {
      this.reset = data;
      if (this.reset == 'resetearOn') {
        $('.mostrar').hide();
        $('.empezar').attr("disabled", false);
        this.menuadivina = 'off';
        $('.jugando').css("display", 'block');
        $('.espera').css("display", 'none');
      }
    });

    this.cinco = this.union.getFinal().subscribe(data => {
      this.ganador = data.ganador;
      $('.mostrar').hide();
      $('.fin').show();
      $('.final').hide();
    });

    this.seis = this.union.getPartidaCancelada().subscribe(data => {
      this.cancelar = data;
      if (this.cancelar == 'cancelada') {
        $('.mostrar').hide();
        $('.fin').show();
        $('.final').hide();
        $('.fin h2').text('Un usuario ha abandonado la partida, vuelve al menú');
        $('.jugando').hide();
      }
    });


  }

  ngOnDestroy() {
    console.log('funciona');
    this.uno.unsubscribe();
    this.dos.unsubscribe();
    this.tres.unsubscribe();
    this.cuatro.unsubscribe();
    this.cinco.unsubscribe();
    this.seis.unsubscribe();
  }

  lanzar() {
    this.dadouno = Math.floor((Math.random() * 6) + 1);
    this.dadodos = Math.floor((Math.random() * 6) + 1);
    this.total = this.dadouno + this.dadodos;
    $('.mostrar').show();
    $('.empezar').attr("disabled", true);
    this.union.sendLanzamiento(this.total);
  }

  mostrar() {
    console.log(this.totalgame);
  }

  sendResultado() {
    let resultado = Math.abs(this.totalgame - $('select').val());
    console.log(resultado);
    $('.jugando').css("display", 'none');
    $('.espera').css("display", 'block');
    this.union.sendRespuesta(resultado);
  }

  verresultados() {
    console.log(this.resultados);
    $('.resultados').fadeIn();
  }

}
