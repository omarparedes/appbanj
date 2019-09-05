import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { SimuladorService } from '../services/simulador.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  datosCliente: boolean = false;
  nombreS: string = "";
  situacionS: string = "";
  gradoS: number;
  nacimientoS: string = "";
  altaS: string = "";
  generoS: string = "";

  titles: any;

  constructor(private nativeStorage: NativeStorage, private route: Router, private _simuladorService: SimuladorService) {

    this.nativeStorage.getItem('usuario')
    .then(
      data => {
        this.datosCliente = true;
        this.nombreS = data.nombre;
        this.situacionS = data.situacion;
        this.gradoS = data.grado;
        this.nacimientoS = data.nacimiento;
        this.altaS = data.alta;
        this.generoS = data.genero
      },
      error => this.datosCliente = false
    );

  }

  guardarDatos(nombre: string, grado: number, nacimiento: string, alta: string, situacion: string, genero: string) {

    this.nativeStorage.setItem('usuario', { nombre, grado, nacimiento, alta, situacion, genero })
    .then(
      (data) => {
        this.route.navigateByUrl("/");
      },
      error => {}
    );

  }

  ngOnInit() {

    this._simuladorService.getTitles()
		.subscribe( data => 
			{
				this.titles = data;
			}
    );
    
  }

}
