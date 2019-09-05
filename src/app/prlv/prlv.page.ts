import { Component, OnInit } from '@angular/core';

import { InversionService } from '../services/inversion.service';

@Component({
  selector: 'app-prlv',
  templateUrl: './prlv.page.html',
  styleUrls: ['./prlv.page.scss'],
})
export class PrlvPage implements OnInit {

  dataPeriodo: any;
  iPeriodo: number = 0;
  error: boolean = false;

  constructor(private _inversionService: InversionService) { }

  ngOnInit() {
  }

  async calculaInversion(monto: number = 0, plazo:number) {

    let periodo: number;
    let tasaBruta = await this._inversionService.getIndice("estrategia", parseFloat(monto.toString()), parseInt(plazo.toString())).then(response => response);
    let tasaNeta: number = tasaBruta - 0.006;
    let interes: number;
    let total: number;
    let montoPeriodo: number = parseFloat(monto.toString());
    
    this.iPeriodo = plazo;

    if(monto < 500) {

      this.error = true;
      this.dataPeriodo = false;

    } else {

      this.error = false;

      this.dataPeriodo = [];
      
      for(periodo = 1; periodo < 13; ++periodo) {
        
        interes = Math.round(parseFloat((montoPeriodo * ((tasaNeta/360) * plazo) * 100).toFixed(2))) / 100;
        total = montoPeriodo + interes;

        this.dataPeriodo.push({periodo, montoPeriodo, interes, total});

        montoPeriodo = total;

      }
      
    }

  }

}
