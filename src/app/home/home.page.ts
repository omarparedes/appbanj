import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';

import { SimuladorService } from '../services/simulador.service';

import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  datosUsuario: any;
  nombre: string = "";
  situacion: string = "";
  grado: number;
  gradoS: string;
  genero: string = "";
  nacimiento: string;
  alta: string;

  titles: any;
  arr: any;

  constructor(private menuCtrl: MenuController, private nativeStorage: NativeStorage, private router: Router, private _simuladorService: SimuladorService) {

    this.nativeStorage.getItem('usuario')
    .then(
      data => {
        this.datosUsuario = data; 
        this.nombre = this.datosUsuario.nombre;
        this.situacion = this.datosUsuario.situacion;
        this.grado = this.datosUsuario.grado;
        this.genero = this.datosUsuario.genero;
        this.nacimiento = this.datosUsuario.nacimiento;
        this.alta = this.datosUsuario.alta;
    
      }, 
      error => this.router.navigateByUrl("/profile")
    ).catch(
      () => this.router.navigateByUrl("/profile")
    );

  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }


  ngOnInit() {

  }

  ionViewWillEnter() {

    this.nativeStorage.getItem('usuario')
    .then(
      data => {
        this.datosUsuario = data; 
        this.nombre = this.datosUsuario.nombre;
        this.situacion = this.datosUsuario.situacion;
        this.grado = this.datosUsuario.grado;
        this.genero = this.datosUsuario.genero;

        let dataTitle: any = [];
        this.arr = [];

        dataTitle.push(this.grado);

        this._simuladorService.getTitles()
        .subscribe( data => 
          {
            this.titles = data;
            
            this.titles.forEach(item => {

              if (item['IdTitle'].includes(dataTitle)) {
                this.gradoS = item.Title;
              }

            });
          }
        );
        
      }, 
      error => this.router.navigateByUrl("/profile")
    ).catch(
      () => this.router.navigateByUrl("/profile")
    );

  }

}
