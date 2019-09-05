import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { SimuladorService } from '../services/simulador.service'

import * as moment from 'moment';

@Component({
  selector: 'app-simulador',
  templateUrl: './simulador.page.html',
  styleUrls: ['./simulador.page.scss'],
})
export class SimuladorPage implements OnInit {

  @Input('birth') sartView: 'month' | 'year' | 'multi-year';
	@ViewChild('monto') montoCred: any;
	promotions: any;
	promotionName: string;
	titles: any;
	arr: any = [];
	showTitle: boolean = false;
	amortizaF: boolean = false;
	errorData: boolean = false;
	dataFilter: any;
	terms: any;
	termsData: any;
	deshabilita: boolean = false;

	muestraAmort: boolean = false;

	selectedValue: number;

	termAmort: any;
	fechaActual: string;

	clienteRetirado: string;

	plazof: number;
	montof: number;

	//Variables amortización
	inicio: number;
	gracia1: any;
	gracia2: any;
	gracia3: any;
	pago: any;
	pagoA: any;
	dias: number;
	amort: any = [];
	M: any;
	sumM: any = 0;
	N: any;
	sumN: any = 0;
	plazo: any = 72;
	monto: any = 100000;
	iva: any = 0;
	tint: any = 9;
	bCalculo: any = 360;
	ComApertura: any = 0;
	SeguroVida: any = 0;
	InteresGracia: any = 0;
	ComAperturaG: any = 0;
	SeguroVidaG: any = 0;
	ImpInteresG: any = 0;
	totalGracia: number = 1;

	valorCAT: number;

	montoInicio: number = 0;
	montoFin: number = 0;

	// Variables retiro
	edadRetiro: number;
	haberRetiro: number;
	gradoInmediato: number;
	datosRetiro: any;
	retiro: any;
	amortizaRetiro: number = 0;
	montoRetiro: any = 0;
	pagoActivo: any;

	sumP: any = 0;

	errorBirth: boolean = false;
	errorEntrance: boolean = false;
	errorAmount: boolean = false;
	errorEntranceValidation: boolean = false;
	errorPlazo: boolean = false;

	// PQ

	montoPQ: number;
	interesPQ: number;
	IVAinteresPQ: number;
	fondoGarantia: number;

	// Native Storage
	datosCliente: boolean = false;
	nombreS: string = "";
	situacionS: string = "";
	gradoS: number;
	nacimientoS: string = "";
	altaS: string = "";
	generoS: string = "";

	SECORE: number;


	constructor(private _simuladorService: SimuladorService, private loadingController: LoadingController, private nativeStorage: NativeStorage) { }

	async ionViewWillEnter() {

		this.nativeStorage.getItem('usuario')
		.then(
		async data => {
			this.datosCliente = true;
			this.nombreS = data.nombre;
			this.situacionS = data.situacion;
			this.gradoS = data.grado;
			this.nacimientoS = data.nacimiento;
			this.altaS = data.alta;
			this.generoS = data.genero

			let g = await this.getTitleData(this.gradoS);
		},
		error => this.datosCliente = false
		);
	}

	getTitleData(title) {

		this.showTitle = false;
		this.amortizaF = false;

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

					this.showTitleData(this.situacionS, this.nacimientoS, this.altaS);

				}
			);

	}

	async showTitleData(value: string, birth: string, entrance: string) {

		let arrData = [];
		let promotions = [];

		this.dataFilter = [];
		this.clienteRetirado = value;

		arrData.push(value);

		this.dataFilter = this.arr.filter(function(v) {
			return arrData.indexOf(v.MilitarStatus) > -1;
		})

		let AntigIni = moment(entrance).format('YYYY-MM-DD');

		let fecha = new Date();

		let fechaHoy = moment([fecha.getFullYear(), fecha.getMonth(), fecha.getDate()]);

		this.dataFilter.forEach(item => {

			if(item.AntigI <= fechaHoy.diff(AntigIni, 'months') && item.AntigF >= fechaHoy.diff(AntigIni, 'months')) {
				
				if (arrData.indexOf(item.MilitarStatus) > -1) {
					promotions.push(item.IdPromotion);
				}

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

		let gradoData = [];
		let edadData = [];
		let gradoRetiro;
		let aniosRetiro;

		gradoData.push((this.gradoS).toString());

		gradoRetiro = this.titles.filter((v) => {
			return gradoData.indexOf(v.IdTitle) > -1;
		});

		this.SECORE = parseFloat((gradoRetiro[0].HaberesSedena * 1.90).toFixed(2));

		edadData.push((this.gradoS).toString());

		aniosRetiro = this.titles.filter((v) => {
			return edadData.indexOf(v.IdTitle) > -1;
		});

		this.edadRetiro = aniosRetiro[0].RetiroSedena;

		let retiroFecha = moment(birth).format('YYYY-MM-DD').split("-");

		let entradaM = moment(entrance).format('YYYY-MM-DD');
		let RetiroM = moment((parseInt(retiroFecha[0]) + parseInt(this.edadRetiro.toString())).toString() + "-" + retiroFecha[1] + "-" + retiroFecha[2]);
		let anioRetiro = RetiroM.diff(entradaM, 'years');

		let aServicio = [];
		let porcentaje;

		aServicio.push(anioRetiro.toString());

		let ret = await this._simuladorService.getRetiro().toPromise().then(response => response);

		this.datosRetiro = ret;

		this.retiro = this.datosRetiro.filter((v) => {
				return aServicio.indexOf(v.AniosServicio) > -1;
		});
    
		porcentaje = this.retiro[0].Porcentaje / 100;

		this.haberRetiro += gradoRetiro[0].HaberesSedena * porcentaje;

		this.SECORE = parseFloat((this.SECORE * this.retiro[0].Factor).toFixed(2));

	}

	showTerms(idPromotion: string) {

		this.selectedValue = 0;

		this.amortizaF = false;

		let termsFilter = [];
		let dataMontos: any;

    	termsFilter.push(idPromotion);

		this.termsData = this.promotions.filter(function(v) {
			return termsFilter.indexOf(v.IdPromotion) > -1;
		});

		dataMontos = this.dataFilter.filter((v) => {
			return termsFilter.indexOf(v.IdPromotion) > -1;
		});

		this.montoInicio = dataMontos[0].MontoMin;
		this.montoFin = dataMontos[0].MontoMax;

		this.terms = this.termsData[0].Terms.split(',');

	}

	async amortiza(monto: number, plazo: number, birth: string, entrance: string, grado: number, secoreS: number = 0) {

		this.amortizaF = false;

		this.deshabilita = true;

		this.plazof = plazo;

		let gradoData = [];
		let edadData = [];
		let gradoRetiro;
		let aniosRetiro;

		let numAmortRetiro = 0;
		let prueba;
		let validaRet = 0;
		let agregaAmort = 0;

		let entrada;

		this.amortizaRetiro = 0;

		this.gradoInmediato = (grado == 102 || grado == 202) ? grado : (grado - 1);

		gradoData.push((grado).toString());

		gradoRetiro = this.titles.filter((v) => {
			return gradoData.indexOf(v.IdTitle) > -1;
		});

		this.SECORE = gradoRetiro[0].HaberesSedena * 1.90;

    	gradoData.push((this.gradoInmediato).toString());

		gradoRetiro = this.titles.filter((v) => {
			return gradoData.indexOf(v.IdTitle) > -1;
		});

		this.haberRetiro = gradoRetiro[0].HaberesSedena * 1.80;

		edadData.push((grado).toString());

		aniosRetiro = this.titles.filter((v) => {
			return edadData.indexOf(v.IdTitle) > -1;
		});

		this.edadRetiro = aniosRetiro[0].RetiroSedena;

		let retiroFecha = moment(birth).format('YYYY-MM-DD').split("-");

		let entradaM = moment(entrance).format('YYYY-MM-DD');
		let RetiroM = moment((parseInt(retiroFecha[0]) + parseInt(this.edadRetiro.toString())).toString() + "-" + retiroFecha[1] + "-" + retiroFecha[2]);
		let anioRetiro = RetiroM.diff(entradaM, 'years');

		let aServicio = [];
		let porcentaje;

		aServicio.push(anioRetiro.toString());

		let ret = await this._simuladorService.getRetiro().toPromise().then(response => response);

		this.datosRetiro = ret;

		this.retiro = this.datosRetiro.filter((v) => {
				return aServicio.indexOf(v.AniosServicio) > -1;
		});
    
		porcentaje = this.retiro[0].Porcentaje / 100;

		this.haberRetiro += gradoRetiro[0].HaberesSedena * porcentaje;

		this.SECORE = parseFloat((this.SECORE * this.retiro[0].Factor).toFixed(2));

		this.montoRetiro = ((this.haberRetiro * 0.30) / 2).toFixed(2);

		let termsAmort = [];

		termsAmort.push(this.termsData[0].IdPromotion);

		this.termAmort = this.dataFilter.filter(function(v) {
			return termsAmort.indexOf(v.IdPromotion) > -1;
		});

		let fecha = new Date();

		let hoy = ("0" + fecha.getDate()).slice(-2) + "/" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "/" + fecha.getFullYear();

		this.fechaActual = hoy;

		let inicioBirth = new Date(fecha.getFullYear() - this.termAmort[0].EdadMin, fecha.getMonth(), fecha.getDate());
		let finBirth = new Date(fecha.getFullYear() - this.termAmort[0].EdadMax, fecha.getMonth(), fecha.getDate());
		let birthS: any = moment(birth).format('YYYY-MM-DD').split("-");

		let birthDate = new Date(birthS[0], Number(birthS[1]) - 1, birthS[2]);

		let inicioEntrance = new Date(fecha.getFullYear() - (this.termAmort[0].AntigI/12), fecha.getMonth(), fecha.getDate());
		let finEntrance = new Date(fecha.getFullYear() - (this.termAmort[0].AntigF/12), fecha.getMonth(), fecha.getDate());
		let EntranceS: any = moment(entrance).format('YYYY-MM-DD').split("-");

		let entranceDate = new Date(EntranceS[0], Number(EntranceS[1]) - 1, EntranceS[2]);

		this.errorEntrance = false;
		this.errorBirth = false;
		this.errorAmount = false;
		this.errorEntranceValidation = false;
		this.errorPlazo = false;

		let entranceValidate = new Date(Number(birthDate.getFullYear()) + Number(this.termAmort[0].EdadMin), birthDate.getMonth(), birthDate.getDate());

		if(inicioEntrance < entranceDate || finEntrance > entranceDate) {
			this.errorEntrance = true;
		}

		if(entranceValidate > entranceDate) {
			this.errorEntranceValidation = true;
		}

		if(inicioBirth < birthDate || finBirth > birthDate) {
			this.errorBirth = true;
		}

		if(Number(monto) > Number(this.termAmort[0].MontoMax) || Number(monto) < Number(this.termAmort[0].MontoMin)) {
			this.errorAmount = true;
		}

		if(plazo == 0) {
			this.errorPlazo = true;
		}

		const loading = await this.loadingController.create({
			message: 'Cargando'
		});

		if(!this.errorAmount && !this.errorBirth && !this.errorEntrance && !this.errorEntranceValidation && !this.errorPlazo) {

			this.promotionName = this.termsData[0].Name;

			this.errorData = false;

			this.amortizaF = false;

			this.tint = this.termsData[0].InterestTax;
			this.iva = this.termsData[0].IVA;
			this.sumN = 0;
			this.sumM = 0;

			this.monto = monto;
			this.plazo = plazo;
			this.amort = [];

			let fecha = new Date();

			this.inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getTime();

			if (this.termsData[0].IdPromotion >= 1000) {

				if(fecha.getDate() > 15) {

					this.gracia1 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
					if (this.gracia1.getDate() == 31) {
						this.gracia1 = new Date(fecha.getFullYear(), fecha.getMonth(), 30);
					}
					this.gracia2 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 15);
					
					this.gracia3 = new Date(fecha.getFullYear(), fecha.getMonth()  +1, 30);
					if (this.gracia3.getDate() == 31) {
						this.gracia3 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 30);
					}

				} else {

					this.gracia1 = new Date(fecha.getFullYear(), fecha.getMonth(), 15);
					this.gracia2 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

					if (this.gracia2.getDate() == 31) {
						this.gracia2 = new Date(fecha.getFullYear(), fecha.getMonth(), 30);
					}

					this.gracia3 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 15);

				}

				if (Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24)) > 0) {
					this.amort.push({"NumAmort": -3, "fecha": this.gracia1.getDate() + '/' + (this.gracia1.getMonth() + 1) + '/' + this.gracia1.getFullYear(), 
								"dias": Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24)), "M": 0, "N": 0, 
								"MontoAmort": (this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo) + this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo * (this.iva/100), 
								"MontoInteres": (this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo).toFixed(2),
								"MontoImpuestos": (this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo * (this.iva/100)).toFixed(2), 
								"Saldo": this.monto, "MontoCapital": 0.00});
				}

				this.amort.push({"NumAmort": -2, "fecha": this.gracia2.getDate() + '/' + (this.gracia2.getMonth() + 1) + '/' + this.gracia2.getFullYear(), 
								"dias": Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24)), "M": 0, "N": 0, 
								"MontoAmort": (this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24))/this.bCalculo) + this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24))/this.bCalculo * (this.iva/100), 
								"MontoInteres": (this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24))/this.bCalculo).toFixed(2),
								"MontoImpuestos": (this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24))/this.bCalculo * (this.iva/100)).toFixed(2), 
								"Saldo": this.monto, "MontoCapital": 0.00});

				this.amort.push({"NumAmort": -1, "fecha": this.gracia3.getDate() + '/' + (this.gracia3.getMonth() + 1) + '/' + this.gracia3.getFullYear(), 
								"dias": Math.trunc((this.gracia3 - this.gracia2)/(1000*60*60*24)), "M": 0, "N": 0, 
								"MontoAmort": (this.monto * (this.tint/100) * Math.trunc((this.gracia3 - this.gracia2)/(1000*60*60*24))/this.bCalculo) + this.monto * (this.tint/100) * Math.trunc((this.gracia3 - this.gracia2)/(1000*60*60*24))/this.bCalculo * (this.iva/100), 
								"MontoInteres": (this.monto * (this.tint/100) * Math.trunc((this.gracia3 - this.gracia2)/(1000*60*60*24))/this.bCalculo).toFixed(2),
								"MontoImpuestos": (this.monto * (this.tint/100) * Math.trunc((this.gracia3 - this.gracia2)/(1000*60*60*24))/this.bCalculo * (this.iva/100)).toFixed(2), 
								"Saldo": this.monto, "MontoCapital": 0.00});

				this.pago = new Date(this.gracia3.getFullYear(), this.gracia3.getMonth(), this.gracia3.getDate());

				for (let i = 1; i <= this.plazo; i++) {

					if(this.pago.getDate() == 15) {

						this.pagoA = this.pago;
						this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth() + 1, 0);

						if (this.pago.getDate() == 31) {
							this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth(), 30);
						}

						this.dias = Math.round((this.pago - this.pagoA)/(1000*60*60*24));

					} else {

						this.pagoA = this.pago;
						this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth() + 1, 15);

						this.dias = Math.round((this.pago - this.pagoA)/(1000*60*60*24));

					}

					this.M = (1 + (((this.tint / 100.000000000) * (1 + (this.iva / 100.000000000)) * this.dias / this.bCalculo))).toPrecision(13);			
					this.sumM = (parseFloat(this.sumM) + Math.log10(parseFloat(this.M))).toPrecision(13);

					let N = (Math.pow(10.000000000, parseFloat(this.sumM))).toPrecision(10);

					this.N = (1/parseFloat(N)).toPrecision(12);

					this.sumN += parseFloat(this.N);

					this.amort.push({"NumAmort": i, "fecha": this.pago.getDate() + '/' + (this.pago.getMonth() + 1) + '/' + this.pago.getFullYear(), 
									"dias": this.dias, 
									"M": parseFloat(this.M), "N": parseFloat(this.N), "MontoAmort": 0});

				}

				let saldo;
				let sumCapital = 0;

				this.amort.forEach(item => {

						if (item["NumAmort"] > 0) {
							item["MontoAmort"] = (this.monto / parseFloat(this.sumN)).toFixed(2);
						}

						if (item["NumAmort"] == 1) {
							item["MontoInteres"] = ((this.monto * (this.tint/100) * item["dias"])/this.bCalculo).toFixed(2);
							item["MontoImpuestos"] = (parseFloat(item["MontoInteres"]) * (this.iva/100)).toFixed(2);
							item["MontoCapital"] = (parseFloat(item["MontoAmort"]) - parseFloat(item["MontoInteres"]) - parseFloat(item["MontoImpuestos"])).toFixed(2);
							item["Saldo"] = this.monto - parseFloat(item["MontoCapital"]) - 0;
							saldo = item["Saldo"];
							sumCapital += parseFloat(item["MontoCapital"]);
						}

						if (item["NumAmort"] > 1 && item["NumAmort"] < this.plazo) {
							item["MontoInteres"] = ((saldo * (this.tint/100) * item["dias"])/this.bCalculo).toFixed(2);
							item["MontoImpuestos"] = (parseFloat(item["MontoInteres"]) * (this.iva/100)).toFixed(2);
							item["MontoCapital"] = (parseFloat(item["MontoAmort"]) - parseFloat(item["MontoInteres"]) - parseFloat(item["MontoImpuestos"])).toFixed(2);
							item["Saldo"] = (saldo - parseFloat(item["MontoCapital"]) - 0).toFixed(2);
							saldo = parseFloat(item["Saldo"]);
							sumCapital += parseFloat(item["MontoCapital"]);
						}

						if (item["NumAmort"] == this.plazo) {
							item["MontoCapital"] = (this.monto - sumCapital).toFixed(2);
							item["MontoInteres"] = ((parseFloat(item["MontoCapital"]) * (this.tint/100) * item["dias"])/this.bCalculo).toFixed(2);
							item["MontoImpuestos"] = (parseFloat(item["MontoInteres"]) * (this.iva/100)).toFixed(2);
							item["Saldo"] = 0.00;
							item["MontoAmort"] = (parseFloat(item["MontoCapital"]) + parseFloat(item["MontoInteres"]) + parseFloat(item["MontoImpuestos"])).toFixed(2);
						}

				});

				this.totalGracia = 3;

			} else {
				
				if (this.termsData[0].frecuency == 2) {

					if(fecha.getDate() > 15) {

						this.gracia1 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
						if (this.gracia1.getDate() == 31) {
							this.gracia1 = new Date(fecha.getFullYear(), fecha.getMonth(), 30);
						}
						this.gracia2 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 15);

					} else {

						this.gracia1 = new Date(fecha.getFullYear(), fecha.getMonth(), 15);
						this.gracia2 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

						if (this.gracia2.getDate() == 31) {
							this.gracia2 = new Date(fecha.getFullYear(), fecha.getMonth(), 30);
						}

					}

					if (this.termsData[0].IdPromotion == 100) {

						this.ComApertura = this.monto * (this.termsData[0].ComApertura/100) * (1 + (this.iva/100));
						this.SeguroVida = parseFloat(((parseFloat(this.termsData[0].SeguroVida) * ((parseFloat(this.ComApertura) + parseFloat(this.monto))/1000) * (parseFloat(this.plazo) + 2)) / 2).toFixed(2));
						this.InteresGracia = parseFloat((((this.tint / 100) * ((parseFloat(this.ComApertura) + parseFloat(this.monto) + parseFloat(this.SeguroVida))) * 32) / 360).toFixed(2));
						this.ComAperturaG = parseFloat(((parseFloat(this.InteresGracia) + (parseFloat(this.InteresGracia) * (this.iva / 100))) * (this.termsData[0].ComApertura / 100) * (1 + (this.iva/100))).toFixed(2));
						this.SeguroVidaG = parseFloat((((parseFloat(this.InteresGracia) + (parseFloat(this.InteresGracia) * (this.iva / 100))) + this.ComAperturaG) / 1000 * parseFloat(this.termsData[0].SeguroVida) * parseFloat(this.plazo)).toFixed(2));
						this.ImpInteresG = parseFloat((parseFloat(this.InteresGracia) * (this.iva/100)).toFixed(2));


						this.monto = parseFloat(this.monto) + parseFloat(this.ComApertura) + parseFloat(this.SeguroVida) + parseFloat(this.InteresGracia) + parseFloat(this.ComAperturaG) + parseFloat(this.SeguroVidaG) + parseFloat(this.ImpInteresG);

					} else if (this.termsData[0].IdPromotion == 111) {

						this.ComApertura = this.monto * (this.termsData[0].ComApertura/100) * (1 + (this.iva/100));

						let dValorAjuste: number;
						let saldoCiclo: number = this.monto;
						let iCount: number = 1;

						while(iCount <= 50) {

							this.SeguroVida = parseFloat((Number(saldoCiclo) * parseFloat(this.termsData[0].SeguroVida) / 1000.000000 * (parseFloat(this.plazo) + 2) / 2).toFixed(2));
							this.InteresGracia = parseFloat((Number(saldoCiclo) * (this.tint / 100) * 32 / 360).toFixed(2));
							this.ImpInteresG = parseFloat((parseFloat(this.InteresGracia) * (this.iva/100)).toFixed(2));

							dValorAjuste = parseFloat(((parseFloat(this.monto) - (Number(saldoCiclo) - this.SeguroVida - this.InteresGracia - this.ImpInteresG)) / 2).toFixed(2));

							saldoCiclo = parseFloat((Number(saldoCiclo) + dValorAjuste).toFixed(2));

							iCount = iCount + 1;

							if(dValorAjuste == 0)
								break;

						}

						this.monto = saldoCiclo;

					}

					if (Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24)) > 0) {
						this.amort.push({"NumAmort": -2, "fecha": this.gracia1.getDate() + '/' + (this.gracia1.getMonth() + 1) + '/' + this.gracia1.getFullYear(), 
									"dias": Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24)), "M": 0, "N": 0, "MontoAmort": 0, 
									"MontoInteres": (this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo).toFixed(2),
									"MontoImpuestos": (this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo * (this.iva/100)).toFixed(2), 
									"Saldo": this.monto, "MontoCapital": 0.00});
					}

					this.amort.push({"NumAmort": -1, "fecha": this.gracia2.getDate() + '/' + (this.gracia2.getMonth() + 1) + '/' + this.gracia2.getFullYear(), 
									"dias": Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24)), "M": 0, "N": 0, "MontoAmort": 0, 
									"MontoInteres": (this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24))/this.bCalculo).toFixed(2),
									"MontoImpuestos": (this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24))/this.bCalculo * (this.iva/100)).toFixed(2), 
									"Saldo": this.monto, "MontoCapital": 0.00});

					this.pago = new Date(this.gracia2.getFullYear(), this.gracia2.getMonth(), this.gracia2.getDate());
					
					for (let i = 1; i <= this.plazo; i++) {

						if(this.pago.getDate() == 15) {

							this.pagoA = this.pago;
							this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth() + 1, 0);

							if (this.pago.getDate() == 31) {
								this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth(), 30);
							}

							this.dias = Math.round((this.pago - this.pagoA)/(1000*60*60*24));

						} else {

							this.pagoA = this.pago;
							this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth() + 1, 15);

							this.dias = Math.round((this.pago - this.pagoA)/(1000*60*60*24));

						}

						if(moment([this.pago.getFullYear(), this.pago.getMonth(), this.pago.getDate()]) >= RetiroM && numAmortRetiro == 0)
						{
							numAmortRetiro = i;
							this.amortizaRetiro = i;
						}

						this.M = (1 + (((this.tint / 100.000000000) * (1 + (this.iva / 100.000000000)) * this.dias / this.bCalculo))).toPrecision(13);
						this.sumM = (parseFloat(this.sumM) + Math.log10(parseFloat(this.M))).toPrecision(13);

						let N = (Math.pow(10.000000000, parseFloat(this.sumM))).toPrecision(10);

						this.N = (1/parseFloat(N)).toPrecision(12);

						this.sumN += parseFloat(this.N);

						this.amort.push({"NumAmort": i, "fecha": this.pago.getDate() + '/' + (this.pago.getMonth() + 1) + '/' + this.pago.getFullYear(), 
										"dias": this.dias, 
										"M": parseFloat(this.M), "N": parseFloat(this.N), "MontoAmort": 0});

					}

				} else {

					this.gracia1 = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

					this.gracia2 = new Date(this.gracia1.getFullYear(), this.gracia1.getMonth() + 2, 0);

					this.pago = new Date(this.gracia2.getFullYear(), this.gracia2.getMonth(), this.gracia2.getDate());

					for (let i = 1; i <= this.plazo; i++) {

						this.pagoA = this.pago;
						this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth() + 2, 0);

						this.dias = Math.round((this.pago - this.pagoA)/(1000*60*60*24));

						this.M = (1 + (((this.tint / 100.000000000) * (1 + (this.iva / 100.000000000)) * this.dias / this.bCalculo))).toPrecision(13);
						this.sumM = (parseFloat(this.sumM) + Math.log10(parseFloat(this.M))).toPrecision(13);

						let N = (Math.pow(10.000000000, parseFloat(this.sumM))).toPrecision(10);

						this.N = (1/parseFloat(N)).toPrecision(12);

						this.sumN += parseFloat(this.N);

						this.amort.push({"NumAmort": i, "fecha": this.pago.getDate() + '/' + (this.pago.getMonth() + 1) + '/' + this.pago.getFullYear(), 
										"dias": this.dias, 
										"M": parseFloat(this.M), "N": parseFloat(this.N), "MontoAmort": 0});
					}

				}


				let secore = secoreS;
				let saldoRetiro: number;

				let amortiza2: any;

				let amortiza1 = await this.amortizacion(this.plazo, this.monto, new Date(this.gracia2.getFullYear(), this.gracia2.getMonth(), this.gracia2.getDate()), 0.00);

				saldoRetiro = amortiza1[numAmortRetiro - 2].Saldo - secore;

				if(saldoRetiro < 0) {
					saldoRetiro = 0;
				}

				if(numAmortRetiro > 0) {

					let fRetiro = amortiza1[numAmortRetiro - 2].fecha.split('/');

					do {
						amortiza2 = await this.amortizacion(plazo - numAmortRetiro - 1, saldoRetiro, new Date(fRetiro[2], fRetiro[1] - 1, fRetiro[0]), 0.00);

						saldoRetiro -= 100;

					} while(amortiza2[0].MontoAmort > (this.montoRetiro / 2));

					let sumaMonto: number = 50;
					do{
						amortiza1 = await this.amortizacion(plazo, this.monto, new Date(this.gracia2.getFullYear(), this.gracia2.getMonth(), this.gracia2.getDate()), sumaMonto);

						sumaMonto += 50;

					} while(amortiza1[numAmortRetiro - 2].Saldo > (amortiza2[0].Saldo + parseFloat(amortiza2[0].MontoAmort)))

					saldoRetiro = amortiza1[numAmortRetiro - 2].Saldo - secore;

					amortiza2 = await this.amortizacion(plazo - numAmortRetiro - 1, saldoRetiro, new Date(fRetiro[2], fRetiro[1] - 1, fRetiro[0]), 0.00);
				}

				this.amort = []

				this.amort.push({"NumAmort": 1, "fecha": this.gracia1.getDate() + '/' + (this.gracia1.getMonth() + 1) + '/' + this.gracia1.getFullYear(), 
									"dias": Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24)), "M": 0, "N": 0, "MontoAmort": 0, 
									"MontoInteres": (this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo).toFixed(2),
									"MontoImpuestos": (this.monto * (this.tint/100) * Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24))/this.bCalculo * (this.iva/100)).toFixed(2), 
									"Saldo": this.monto, "MontoCapital": 0.00});

				this.amort.push({"NumAmort": 2, "fecha": this.gracia2.getDate() + '/' + (this.gracia2.getMonth() + 1) + '/' + this.gracia2.getFullYear(), 
								"dias": Math.trunc((this.gracia2 - this.gracia1)/(1000*60*60*24)), "M": 0, "N": 0, "MontoAmort": 0, 
								"MontoInteres": (this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.inicio)/(1000*60*60*24))/this.bCalculo).toFixed(2),
								"MontoImpuestos": (this.monto * (this.tint/100) * Math.trunc((this.gracia2 - this.inicio)/(1000*60*60*24))/this.bCalculo * (this.iva/100)).toFixed(2), 
								"Saldo": this.monto, "MontoCapital": 0.00});
								
				amortiza1.forEach((item, index) => {
					if(index < (numAmortRetiro - 1)) {
						this.amort.push(item);
					}
				});

				this.pagoActivo = amortiza1[0].MontoAmort;

				amortiza2.forEach(item => {
					item.NumAmort += (numAmortRetiro - 1);
					this.amort.push(item);
				});

				this.montoRetiro = amortiza2[0].MontoAmort;
				

				this.amort[0].NumAmort = 1;

				if (Math.trunc((this.gracia1 - this.inicio)/(1000*60*60*24)) > 0) {
					this.amort[1].NumAmort = 2;
					this.totalGracia = 2;
				}

			}

			this.amortizaF = true;

			this.calculaCAT(monto);

		} else {

			this.errorData = true;

			this.amortizaF = false;

		}

		this.montof = this.monto;

	}

	calculaCAT(monto: number) {

		let dMonto: number = monto;
		let pagosAnual: number = 24;
		let valorEsperado: number = parseFloat(this.termsData[0].InterestTax) / 100;
		let montoInicial: number = (parseFloat(this.termsData[0].ComApertura) / 100) * parseFloat(this.monto);
		let IVAProducto: number = parseFloat(this.termsData[0].IVA);
		let montoCAT: number = 0.00000000;
 
		let IVAInteresGracia = Number((((valorEsperado * IVAProducto) + valorEsperado) / pagosAnual).toFixed(4)) * dMonto * this.totalGracia - dMonto * (valorEsperado / pagosAnual) * this.totalGracia;//

		let InteresGracia = dMonto * Number((((valorEsperado * IVAProducto) + valorEsperado) / pagosAnual).toFixed(4)) * 2;// * 2

		montoInicial += InteresGracia;

		let index: number;

		let PagoMen: number;

		if (this.termsData[0].frecuency == 3) {
			pagosAnual = 12;
    	}

		if(this.termsData[0].IdPromotion == 100 || this.termsData[0].IdPromotion == 111 || this.termsData[0].IdPromotion == 201) {
			montoInicial = 0;
			IVAInteresGracia = 0;
			InteresGracia = 0;
			dMonto = dMonto - (this.monto * (this.termsData[0].FondoContingencia/100.00));
		} else if (this.termsData[0].IdPromotion >= 1000) {

			let montoInteres = 0;
			let comisionApertura = 0;
			IVAInteresGracia = 0;

			for(let i = 1 ; i <= this.totalGracia ; ++i) {
				montoInteres += Number(this.amort[i - 1].MontoInteres);
				IVAInteresGracia += Number(this.amort[i - 1].MontoImpuestos);
			}

			this.interesPQ = montoInteres;

			comisionApertura = (parseFloat(this.termsData[0].ComApertura) / 100) * parseFloat(this.monto);

			this.fondoGarantia = this.monto * (this.termsData[0].FondoGarantia / 100);

			if(this.clienteRetirado == "Retirado") {
				this.fondoGarantia = this.monto * 0.02;	
			}

			this.IVAinteresPQ = montoInteres * IVAProducto / 100;

			this.montoPQ = comisionApertura;

			montoInicial = Number((comisionApertura + this.fondoGarantia + montoInteres).toFixed(2));

		}

		while (valorEsperado < 2) {

			montoCAT = 0.00000000;
			index = 0;
			PagoMen = 0;

			this.amort.forEach(item => {

				++index;

				if(parseFloat(item["MontoCapital"]) > 0){

					PagoMen = parseFloat(item["MontoAmort"]) - parseFloat(item["MontoImpuestos"]);

				}

				montoCAT += PagoMen / Math.pow(1 + parseFloat(valorEsperado.toPrecision(4)), (index / pagosAnual));

			});

			if (montoCAT <= Number(dMonto) - montoInicial) {
				valorEsperado = parseFloat(valorEsperado.toPrecision(4)) - 0.0001;
				break;
			}

			valorEsperado = parseFloat(valorEsperado.toPrecision(4)) + 0.0001;

		}

		this.valorCAT = Math.round(parseFloat((valorEsperado * 100).toFixed(2)) * 10) / 10;
		
		this.deshabilita = false;

	}

	printTable() {

		let popupWinindow
		let innerContents = document.getElementById("printed").innerHTML;
		popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWinindow.document.open();
		popupWinindow.document.write('<html><head><style>*{font-family: Arial, Verdana;font-size: 12px;}.amort {font-family: Arial, Verdana;width: 95%;border-collapse: collapse;font-size: 12px;font-style: normal;font-weight: lighter;text-align: center; margin: 2.5%;}.mat-toolbar, .mat-button, .amort thead {background: #006162!important;color: #FFF!important;}.amort tbody tr td, .amort thead tr, .amort thead tr th, .amort tbody tr  {border: 1px solid #006162!important;font-weight: lighter;padding: 5px;} .table-warning, .table-warning > td, .table-warning > th { background-color: #FFEEBA; } .table-success, .table-success > td, .table-success > th { background-color: #C3E6CB; }</style></head><body onload="window.print()">' + innerContents + '</html>');

		popupWinindow.document.close(); // necessary for IE >= 10
		popupWinindow.focus(); // necessary for IE >= 10*/

		popupWinindow.print();
		popupWinindow.close();

	}

	showAmort() {
		if(this.muestraAmort) {
			this.muestraAmort = false;
		} else {
			this.muestraAmort = true;
		}
	}

  	ngOnInit() {

		this._simuladorService.getTitles()
		.subscribe( data => 
			{
				this.titles = data;
			}
		);
		
	}

	amortizacion(plazo:number, montoTotal: number, fechaInicio: Date, agrega: number) {

		this.pago = fechaInicio;

		this.plazo = plazo;

		this.sumM = 0;
		this.sumN = 0;
		this.M = 0;
		this.N = 0;

		this.amort = [];

		for (let i = 1; i <= this.plazo; i++) {

			if(this.pago.getDate() == 15) {

				this.pagoA = this.pago;
				this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth() + 1, 0);

				if (this.pago.getDate() == 31) {
					this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth(), 30);
				}

				this.dias = Math.round((this.pago - this.pagoA)/(1000*60*60*24));

			} else {

				this.pagoA = this.pago;
				this.pago = new Date(this.pago.getFullYear(), this.pago.getMonth() + 1, 15);

				this.dias = Math.round((this.pago - this.pagoA)/(1000*60*60*24));

			}

			this.M = (1 + (((this.tint / 100.000000000) * (1 + (this.iva / 100.000000000)) * this.dias / this.bCalculo))).toPrecision(13);			
			this.sumM = (parseFloat(this.sumM) + Math.log10(parseFloat(this.M))).toPrecision(13);

			let N = (Math.pow(10.000000000, parseFloat(this.sumM))).toPrecision(10);

			this.N = (1/parseFloat(N)).toPrecision(12);

			this.sumN += parseFloat(this.N);

			this.amort.push({"NumAmort": i, "fecha": this.pago.getDate() + '/' + (this.pago.getMonth() + 1) + '/' + this.pago.getFullYear(), 
							"dias": this.dias, 
							"M": parseFloat(this.M), "N": parseFloat(this.N), "MontoAmort": 0});

		}

		let montoAmortiza = montoTotal;
		let saldo = 0;
		let sumCapital = 0;
		let agregaAmort: number = agrega;

		this.amort.forEach(item => {

			if (item["NumAmort"] > 0) {
				item["MontoAmort"] = (((montoAmortiza / parseFloat(this.sumN))) + agregaAmort).toFixed(2);
			}

			if (item["NumAmort"] == 1) {
				item["MontoInteres"] = ((montoAmortiza * (this.tint/100) * item["dias"])/this.bCalculo).toFixed(2);
				item["MontoImpuestos"] = (parseFloat(item["MontoInteres"]) * (this.iva/100)).toFixed(2);
				item["MontoCapital"] = (parseFloat(item["MontoAmort"]) - parseFloat(item["MontoInteres"]) - parseFloat(item["MontoImpuestos"])).toFixed(2);
				item["Saldo"] = montoAmortiza - parseFloat(item["MontoCapital"]) - 0;
				saldo = item["Saldo"];
				sumCapital += parseFloat(item["MontoCapital"]);
			}

			if (item["NumAmort"] > 1 && item["NumAmort"] < this.plazo) {
				item["MontoInteres"] = ((saldo * (this.tint/100) * item["dias"])/this.bCalculo).toFixed(2);
				item["MontoImpuestos"] = (parseFloat(item["MontoInteres"]) * (this.iva/100)).toFixed(2);
				item["MontoCapital"] = (parseFloat(item["MontoAmort"]) - parseFloat(item["MontoInteres"]) - parseFloat(item["MontoImpuestos"])).toFixed(2);
				item["Saldo"] = (saldo - parseFloat(item["MontoCapital"]) - 0).toFixed(2);
				saldo = parseFloat(item["Saldo"]);
				sumCapital += parseFloat(item["MontoCapital"]);
			}

			if (item["NumAmort"] == this.plazo) {
				item["MontoCapital"] = (montoAmortiza - sumCapital).toFixed(2);
				item["MontoInteres"] = ((parseFloat(item["MontoCapital"]) * (this.tint/100) * item["dias"])/this.bCalculo).toFixed(2);
				item["MontoImpuestos"] = (parseFloat(item["MontoInteres"]) * (this.iva/100)).toFixed(2);
				item["Saldo"] = 0.00;
				item["MontoAmort"] = parseFloat(item["MontoCapital"]) + parseFloat(item["MontoInteres"]) + parseFloat(item["MontoImpuestos"]);
			}

		});

		return this.amort;

	}

}
