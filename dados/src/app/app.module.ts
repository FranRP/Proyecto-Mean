import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ServicioService} from "./servicio.service";
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {LoginComponent} from './login/login.component';
import {MenuComponent} from './menu/menu.component';
import {ChatComponent} from './chat/chat.component';
import {UsersComponent} from './users/users.component';
import {PartidaComponent} from './partida/partida.component';
import { ChatpartidaComponent } from './chatpartida/chatpartida.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'partida', component: PartidaComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', component: LoginComponent}
]

export const routing = RouterModule.forRoot(routes);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    ChatComponent,
    UsersComponent,
    PartidaComponent,
    ChatpartidaComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing
  ],
  providers: [ServicioService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
