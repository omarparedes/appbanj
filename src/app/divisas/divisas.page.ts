import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const URL = 'https://free.currconv.com/api/v7/convert?q=USD_MXN,GBP_MXN,EUR_MXN,CAD_MXN,JPY_MXN,BTC_MXN&compact=ultra&apiKey=290d1707f19c3fa8020c';
@Component({
  selector: 'app-divisas',
  templateUrl: './divisas.page.html',
  styleUrls: ['./divisas.page.scss'],
})

export class DivisasPage implements OnInit {

  divisas: any;
  calculo: boolean = false;

  constructor(private http: HttpClient) {}

  async calculaDivisas() {
    let respuesta = await this.http.get(URL).toPromise().then(response => { this.divisas = response; });

    console.log(this.divisas)
    this.calculo = true;
  }

  ngOnInit() {

    this.calculaDivisas();

  }

}
