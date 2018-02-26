import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicioService} from "../servicio.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  arrayUsers = [];
  uno: any;

  constructor(private union: ServicioService) {
  }

  ngOnInit() {
    this.uno = this.union.getUsuarios().subscribe(data => {
      this.arrayUsers = (data);
    });
  }

  ngOnDestroy() {
    this.uno.unsubscribe();
  }

  prueba() {
    console.log(this.arrayUsers);
  }


}
