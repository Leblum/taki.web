import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IProduct } from '../models/index';
import { environment } from '../environments/environment';
import { MimeType } from '../enumerations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService extends BaseService<IProduct>{
    constructor(public http: Http) {
        super(http, {
            rootApiUrl: `${environment.ProductAPIBase}${environment.V1}`,
            urlSuffix: 'products'
        });
     }

     deleteProductImage(productId:string, imageId: string): Observable<Response> {
        console.log(`About to delete image: ${imageId}`);
        return this.http
        .delete(`${this.serviceConfig.rootApiUrl}/${this.serviceConfig.urlSuffix}/delete-image/${productId}/${imageId}`, 
            new RequestOptions({
            headers: new Headers({ 
                'Content-Type': MimeType.JSON , 
                'x-access-token': localStorage.getItem(CONST.CLIENT_TOKEN_LOCATION) 
            })
        }))
        .map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
    }
}