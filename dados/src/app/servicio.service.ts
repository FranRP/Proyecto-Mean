import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {environment} from '../environments/environment';

@Injectable()
export class ServicioService {
  //private url = 'http://localhost:3000';
  private url = environment.serverSocket;
  private socket;
  public conectado: any = false;
  public usuario;
  public arrayUsers = [];

  constructor() {
    this.socket = io(this.url);
  }

  modificaNombre(nickname) {
    if (this.arrayUsers.indexOf(nickname) == -1) {
      this.usuario = nickname;
      this.socket.emit('añadir-nombres', this.usuario);

    } else {
      this.usuario = nickname + Math.floor(Math.random() * (99999 - 1) + 1);
      this.socket.emit('añadir-nombres', this.usuario);
    }
  }

  sendComprobador(nick) {
    this.socket.emit('añadir-nombres', nick);
  }

  getArrayNombres(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('aviso', (data) => {
        observer.next(data);
      });
    });
  }

  public sendMessage(message) {

    this.socket.emit('new-message', message);
  }

  public sendEntroMenu() {
    this.socket.emit('entro-menu');
  }

  public sendMensajeSala(message) {
    console.log("SERVICIO ENVIA " + message)
    this.socket.emit('mensaje-sala', message);
  }

  getSala(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('conectarSala', (data) => {
        observer.next(data);
      });
    });
  }

  getPartidaCancelada(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('partida-cancelada', (data) => {
        observer.next(data);
      });
    });
  }

  sendPartida() {
    this.socket.emit('nuevapartida');
  }

  sendUsuarioGame() {
    this.socket.emit('usuarioInGame');
  }

  public sendUsuario(user) {
    if (!this.conectado) {
      this.socket.emit('nuevousuario', user);
      this.conectado = true;
    } else {
      this.socket.emit('recargar-lista-usuarios', user);
      this.socket.emit('salir-sala');
    }
  }

  public sendLanzamiento(valor) {
    this.socket.emit('lanzardados', valor);
  }

  public sendRespuesta(valor) {
    this.socket.emit('respuesta', valor);
  }

  public sendSumaScore() {
    this.socket.emit('sumarScore');
  }

  public getMessage(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('mensajechat', (message) => {
        observer.next(message);
        console.log(message);
      });
    });
  }

  public getReset(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('resetear-ronda', (activador) => {
        observer.next(activador);
      });
    });
  }


  public getFinal(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('partida-terminada', (activador) => {
        observer.next(activador);
      });
    });
  }

  public getGanadorRonda(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('ganador-ronda', (objeto) => {
        observer.next(objeto);
      });
    });
  }

  public getAdivinanza(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('valor-adivinar', (valor) => {
        observer.next(valor);
      });
    });
  }

  public getMensajeSala(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('mensaje-chat', (message) => {
        observer.next(message);
        console.log(message);
      });
    });
  }

  public getAviso(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('comienza', (dato) => {
        observer.next(dato);
        console.log(dato);
      })
    })
  }

  public getUsuarios(): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on('usuarios', (users) => {
        observer.next(users);
        console.log(users);
      });
    });
  }


}
