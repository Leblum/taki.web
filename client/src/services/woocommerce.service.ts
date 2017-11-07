import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IOrder, WooCommerce } from '../models/index';
import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WooCommerceService extends BaseService<WooCommerce.Order>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.WooApiLocation}`,
            urlSuffix: 'orders'
        });
     }

     public getOrder(id: number): Observable<WooCommerce.Order>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('consumer_key',environment.WooConsumerKey);
        params.set('consumer_secret',environment.WooConsumerSecret);
        let headers = new Headers();
        if(environment.production == false){
            headers.append("Authorization", "Basic " + btoa(environment.WooStagingUser + ":" + environment.WooStagingPass)); 
            headers.append("Content-Type", "application/x-www-form-urlencoded");
        }

        return this.http
            .get(this.serviceConfig.rootApiUrl,{
                params: params,
                headers: headers,
            })
            .map((res: Response) => {
                console.dir(res);
                return res.json();
            })
            .catch(this.handleError);
     }
}