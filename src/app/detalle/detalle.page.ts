import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SimuladorService } from '../services/simulador.service'

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  idPromotion: number;
  name: string;
  promotions: any;
  promotion: any;
  complete: boolean = false;
  tipo: string;

  grado: number;
  situacion: string;
  nacimiento: any;
  alta: any;

  titles: any;
	arr: any = [];
	errorData: boolean = false;
	dataFilter: any;
	clienteRetirado: string;
	showTitle: boolean = false;
	options: boolean =  false;

  constructor(private route: ActivatedRoute, private _simuladorService: SimuladorService) {

    this.route.queryParamMap.subscribe(params => {

      let data = params;
      this.idPromotion = data["params"].idPromotion;

      this.grado = data["params"].grado;
      this.situacion = data["params"].situacion;
      this.tipo = data["params"].tipo;


    });

  }

  getTitleData(title) {

		let dataTitle: any = [];
		this.arr = [];

    dataTitle.push(title);
    
    let promoGeneral: any;

		this._simuladorService.getData()
			.subscribe( data => 
				{
					this.dataFilter = data;

					this.dataFilter.forEach(item => {

						if (item['IdTitle'].includes(dataTitle)) {
              this.arr.push(item);
            }

          });

          let arrData = [];

          arrData.push(this.situacion);

          this.dataFilter = this.arr.filter(function(v) {
            return arrData.indexOf(v.MilitarStatus) > -1;
          });

          let prod = [];
          prod.push(this.idPromotion);

          let promocion = this.dataFilter.filter((v) => {
            return prod.indexOf(v.IdPromotion) > -1;
          });
      
          promoGeneral = promocion[0];

				}
      );

      
  
  }

  async ngOnInit() {

    let filter: any = [];

    let promociones = await this._simuladorService.getData().toPromise().then(response => response);

    this.promotions = promociones;

    filter.push(this.situacion);

    promociones = this.promotions.filter((v) => {
      return filter.indexOf(v.MilitarStatus) > -1;
    });

    this.promotions = promociones;

    filter = [];
    filter.push(this.grado);

    promociones = this.promotions.filter((v) => {
      return filter.indexOf(v.IdTitle) > -1;
    });

    this.promotions = promociones;

    filter = [];
    filter.push(this.idPromotion);

    promociones = this.promotions.filter((v) => {
      return filter.indexOf(v.IdPromotion) > -1;
    });    

    this.promotion = promociones[0];

    promociones = await this._simuladorService.getPromotions().toPromise().then(response => response);

    this.promotions = promociones;

    promociones = this.promotions.filter((v) => {
      return filter.indexOf(v.IdPromotion) > -1;
    });

    this.promotions = promociones[0];

    this.complete = true;

  }

}
