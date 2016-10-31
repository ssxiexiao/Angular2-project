import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Strike } from '../util/strike';
import { CSV } from '../util/csv';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RequestService {

	constructor(private http: Http) {
	}

	getData(): Promise<any> {
		return this.http.get('/public/1.csv')
							 .toPromise()
							 .then((response) => {
							 		return CSV(response.text());
							 })
							 .catch(this.handleError);
	}

	handleError(err: any): Promise<any> {
		return Promise.reject(err.message || err);
	}
}