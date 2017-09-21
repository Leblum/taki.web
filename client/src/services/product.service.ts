import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import * as jwtDecode from 'jwt-decode';
import { IProduct } from '../models/index';
import { environment } from '../environments/environment';

@Injectable()
export class ProductService extends BaseService<IProduct>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.ProductAPIBase}${environment.V1}`,
            urlSuffix: 'products'
        });
     }
}