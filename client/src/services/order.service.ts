import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IOrder } from '../models/index';
import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderService extends BaseService<IOrder>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.ProductAPIBase}${environment.V1}`,
            urlSuffix: 'orders'
        });
     }
}