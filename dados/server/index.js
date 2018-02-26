// let express = require('express')
// let app = express();
//
// let http = require('http');
// let server = http.Server(app);
//
// let socketIO = require('socket.io');
// let io = socketIO(server);
// const socketIO = require('socket.io');
// const port = process.env.PORT || 3000;

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017');
//
// var db = mongoose.connection;
// db.on('error', console.error.bind(console.log('connection error:')));
// db.once('open', function () {
//
// });


var users = [];
var roomno = 1;
var salaUsers = [[]];
var lanzamientodados = [[{'total': 0, 'cont': 0}]];
var respuestas = [[]];
var puntuacionparaganar = [];
var ganadoressala = [[]];

var nombres = [];

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('añadir-nombres', nombre => {
    if (nombres.indexOf(nombre) == -1
    ) {
      if (nombre != "") {
        nombres.push(nombre);
        console.log(nombres + ' --------------------------------------');
        socket.emit('aviso', 'disponible');
      } else {
        socket.emit('aviso', 'vacio');
      }
    }
    else {
      console.log('no disponible');
      socket.emit('aviso', 'no');
    }
  })
  ;

  socket.on('recargar-lista-usuarios', user => {
    if (users.indexOf(user) == -1
    ) {
      users.push(user);
    }

    if (salaUsers[socket.sala - 1].indexOf(socket.username) != -1) {
      salaUsers[socket.sala - 1] = salaUsers[roomno - 1].filter(user => user != socket.username
      )
      ;
      io.to("sala-" + socket.sala).emit('partida-cancelada', 'cancelada');
    }

    socket.username = user;
    socket.score = 0;
    io.emit('usuarios', users);
  })
  ;

  socket.on('nuevousuario', (user) => {
    console.log('usuario introducido', user);
    socket.leave("sala-" + socket.sala);
    if (users.indexOf(user) == -1) {
      users.push(user);
    }
    socket.username = user;
    socket.score = 0;
    io.emit('usuarios', users);

    socket.on('new-message', (message) => {
      if ((message.mensaje != '') && (message.mensaje != undefined)
      ) {
        console.log(message.mensaje + ' ----sssssssssssssssss')
        io.emit('mensajechat', message);
      }
    })
    ;

    socket.on('salir-sala', function () {
      socket.leave("sala-" + socket.sala);
    });

    socket.on('entro-menu', function () {
      socket.removeAllListeners('mensaje-sala');
      socket.removeAllListeners('lanzardados');
      socket.removeAllListeners('respuesta');
      socket.removeAllListeners('sumarScore');
      socket.removeAllListeners('respuesta');
    });


    socket.on('nuevapartida', function () {

      if (io.nsps['/'].adapter.rooms["sala-" + roomno] && io.nsps['/'].adapter.rooms["sala-" + roomno].length > 2) roomno++;
      socket.join("sala-" + roomno);
      socket.sala = roomno;
      salaUsers[roomno - 1].push(socket.username);
      io.to("sala-" + roomno).emit('conectarSala', {'usuario': salaUsers[roomno - 1], 'sala': roomno});
      if (salaUsers[roomno - 1].length == 3) {
        roomno++;
        io.to("sala-" + socket.sala).emit('comienza', 'activar');
        salaUsers.push([]);
        respuestas.push([]);
        puntuacionparaganar.push(1000);
        ganadoressala.push([]);
        lanzamientodados.push([{'total': 0, 'cont': 0}]);
      } else {
        io.to("sala-" + socket.sala).emit('comienza', 'desactivar');
      }
      console.log(roomno + ' esta es la sala');
      socket.on('mensaje-sala', (message) => {
        if ((message != '') && (message != undefined)
        ) {
          io.to("sala-" + socket.sala).emit('mensaje-chat', {'usuario': socket.username, 'mensaje': message});
        }
      })
      ;
      socket.on('lanzardados', (valor) => {
        lanzamientodados[socket.sala - 1][0].total = parseInt(lanzamientodados[socket.sala - 1][0].total) + valor;
        lanzamientodados[socket.sala - 1][0].cont += 1;
        if (lanzamientodados[socket.sala - 1][0].cont == 3) {
          let adivinanza = lanzamientodados[socket.sala - 1][0].total;
          io.to("sala-" + socket.sala).emit('valor-adivinar', {'estado': 'on', 'value': adivinanza});
        }

      })
      ;

      socket.on('respuesta', (valor) => {
        respuestas[socket.sala - 1].push({'user': socket.username, 'valor': valor, 'ganador': 'no'});
        if (respuestas[socket.sala - 1].length == 3) {
          for (let elemento of respuestas[socket.sala - 1]) {
            if (elemento.valor < puntuacionparaganar[socket.sala - 1]) {
              puntuacionparaganar[socket.sala - 1] = elemento.valor;
            }
          }
          for (let elemento of respuestas[socket.sala - 1]) {
            if (elemento.valor == puntuacionparaganar[socket.sala - 1]) {
              elemento.ganador = 'si';
            }
          }
          for (let elemento of respuestas[socket.sala - 1]) {
            if (elemento.ganador == 'si') {
              ganadoressala[socket.sala - 1].push(elemento);
            }
          }
          if (ganadoressala[socket.sala - 1].length == 1) {
            io.to("sala-" + socket.sala).emit('ganador-ronda', ganadoressala[socket.sala - 1]);
          } else {
            io.to("sala-" + socket.sala).emit('mensaje-chat', {
              'usuario': 'Servidor',
              'mensaje': 'Hubo empate por lo que no se suman puntos. La suma de los dados era ' + lanzamientodados[socket.sala - 1][0].total
            });
            lanzamientodados[socket.sala - 1] = [{'total': 0, 'cont': 0}];
          }

          console.log('ronda terminada');

          puntuacionparaganar[socket.sala - 1] = 1000;

          ganadoressala[socket.sala - 1] = [];
          respuestas[socket.sala - 1] = [];

          io.to("sala-" + socket.sala).emit('resetear-ronda', 'resetearOn');

        }
      })
      ;

      socket.on('sumarScore', function () {
        io.to("sala-" + socket.sala).emit('mensaje-chat', {
          'usuario': 'Servidor',
          'mensaje': 'Ha ganado 1 ronda el usuario ' + socket.username + '. El total de los dados era ' + lanzamientodados[socket.sala - 1][0].total
        });
        lanzamientodados[socket.sala - 1] = [{'total': 0, 'cont': 0}];
        socket.score += 1;
        if (socket.score == 3) {
          io.to("sala-" + socket.sala).emit('partida-terminada', {'ganador': socket.username, 'partida': 'finalizada'});
          console.log(socket.username + ' ha ganado');
        }
      });


    });

    socket.on('usuarioInGame', function () {
      users = users.filter(user => user != socket.username
      )
      ;
      io.emit('usuarios', users);
    });

  })
  ;

  socket.on('disconnect', function () {
    console.log('user disconnected');
    users = users.filter(user => user != socket.username
    )
    ;
    io.emit('usuarios', users);
    salaUsers[socket.sala - 1] = salaUsers[roomno - 1].filter(user => user != socket.username
    )
    ;
    // io.to("sala-" + socket.sala).emit('conectarSala', {'usuario': salaUsers[roomno - 1], 'sala': roomno});
    io.to("sala-" + socket.sala).emit('partida-cancelada', 'cancelada');
    nombres = nombres.filter(user => user != socket.username
    )
    ;
  });

})
;


server.listen(port, () => {
  console.log(`started on port: ${port}`);
})
;


