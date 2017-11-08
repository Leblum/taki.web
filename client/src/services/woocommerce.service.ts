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
        //params.append('consumer_key',environment.WooConsumerKey);
        //params.append('consumer_secret',environment.WooConsumerSecret);

        let headers = new Headers();
        if(environment.production == false){
            headers.append("Authorization", "Basic " + btoa(environment.WooStagingUser + ":" + environment.WooStagingPass)); 
            headers.append("Content-Type", "application/x-www-form-urlencoded");
        }

        console.log('about to hit woocommerce');
        //console.dir(params.getAll('consumer_key'));
        return this.http
            .get('/woo/' + this.serviceConfig.rootApiUrl + '/orders' + `/${id}`  + `?consumer_key=${environment.WooConsumerKey}&consumer_secret=${environment.WooConsumerSecret}`,{
                headers: headers,
            })
            .map((res: Response) => {
                console.dir(res.json());
                return res.json();
            })
            .catch(this.handleError);
     }
}