import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SimuladorService {

	url: string = 'assets/json/';

  constructor(private http:HttpClient) { }

	getPromotions() {
		return this.http.get(this.url + 'promotions.json');
	}

	getTitles() {
		return this.http.get(this.url + 'titles.json');
	}

	getData() {
		return this.http.get(this.url + 'filterData.json');
	}

	getRetiro() {
		return this.http.get(this.url + 'retiro.json');
	}
  
}
