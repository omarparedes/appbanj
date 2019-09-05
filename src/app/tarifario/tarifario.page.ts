import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SimuladorService } from '../services/simulador.service'

@Component({
	selector: 'app-tarifario',
	templateUrl: './tarifario.page.html',
	styleUrls: ['./tarifario.page.scss'],
})

export class TarifarioPage implements OnInit {

	titles: any;
	arr: any = [];
	errorData: boolean = false;
	dataFilter: any;
	clienteRetirado: string;
	promotions: any;
	showTitle: boolean = false;
	options: boolean =  false;

	grado: number;
	situacion: string;

	constructor(private _simuladorService: SimuladorService, private route: ActivatedRoute) {

		this.route.queryParamMap.subscribe(params => {

			let data = params;
		
			this.grado = data["params"].grado;
			this.situacion = data["params"].situacion;

			this.getTitleData(this.grado);

		});

	}

	getTitleData(title: number) {

		let dataTitle: any = [];
		this.arr = [];

		dataTitle.push(title);

		this._simuladorService.getData()
			.subscribe( data => 
				{
					this.dataFilter = data;

					this.dataFilter.forEach(item => {

						if (item['IdTitle'].includes(dataTitle)) {
            	  			this.arr.push(item);
			            }

					});

					this.showTitleData(this.situacion);

				});
	
  
	}
	
	showTitleData(value: string) {

		let arrData = [];
		let promotions = [];

		this.dataFilter = [];
		this.clienteRetirado = value;

		arrData.push(value);

		this.dataFilter = this.arr.filter(function(v) {
			return arrData.indexOf(v.MilitarStatus) > -1;
		})

		this.dataFilter.forEach(item => {
			if (arrData.indexOf(item.MilitarStatus) > -1) {
				promotions.push(item.IdPromotion);
			}
		});

		this._simuladorService.getPromotions()
			.subscribe( data => 
				{ 
					this.promotions = data;

					this.promotions = this.promotions.filter(function(v) {
						return promotions.indexOf(v.IdPromotion) > -1;
					});
				}
      );
    
		this.showTitle = true;

	}

	ngOnInit() { }

}
