import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InversionService {

  url: string = 'assets/json/';
  respuesta: any;
  arr: any = [];

  constructor(private http:HttpClient) { }

	async getIndice(inversion: string, monto: number, plazo: number) {

    let tasa: number;
    let tasaFinal: boolean = false;
    let arrData = [];
    arrData.push(plazo);

    this.respuesta = [];

    let indice = await this.http.get(this.url + 'inversion.json').toPromise().then(response => response);    

    this.arr = indice;

    this.respuesta = this.arr.filter(function(v) {
			return arrData.indexOf(v.plazo) > -1;
    });
    
    this.respuesta.forEach(element => {

      if(element.rango <= monto) {
        tasa = element.valor;
      }
      
    });
    
    return tasa;
	}
  
}
