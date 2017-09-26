import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import { IProduct } from '../models/index';
import { Config } from '../config/config';
import { IdentityApiService } from './identity.api.service';

export class ProductApiService extends BaseService<IProduct>{
    constructor(endpoint:string) {
        super(endpoint);
        super.baseUrl = Config.active.get('productApiEndpoint');
        super.apiName = 'taki-to-product-api';
     }
}