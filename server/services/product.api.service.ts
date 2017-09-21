import { BaseService } from "./base/base.service";
import { Config } from '../config/config';
import { CONST } from "../constants";

import * as moment from 'moment';
import * as superagent from "superagent";

import * as chai from 'chai';
import { IdentityApiService } from "./index";

const expect = chai.expect;
const should = chai.should();

export class ProductApiService extends BaseService {

    private static _constructor = (async () => {
        BaseService.baseUrl = Config.active.get('productApiEndpoint');
        BaseService.apiName = 'Product.Api.Service';
        BaseService.systemAuthToken = await IdentityApiService.authenticateSystemUser();
    })();
}