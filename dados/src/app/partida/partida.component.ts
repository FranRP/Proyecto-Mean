import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicioService} from "../servicio.service";

@Component({
  selector: 'app-partida',
  templateUrl: './partida.component.html',
  styleUrls: ['./partida.component.css']
})
export class PartidaComponent implements OnInit, OnDestroy {
  sala: string;
  name: string;
  uno: any;

  constructor(private union: ServicioService) {
  }

  ngOnInit() {
    this.uno = this.union.getSala().subscribe(data => {
      this.sala = data.sala;
    });
    this.name = this.union.usuario;

  }

  ngOnDestroy() {
    this.uno.unsubscribe();
  }

}
