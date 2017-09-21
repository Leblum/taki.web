import { BaseService } from "./base/base.service";
import { Config } from '../config/config';
import { CONST } from "../constants";

import * as moment from 'moment';
import * as superagent from "superagent";

import * as chai from 'chai';

const expect = chai.expect;
const should = chai.should();

export class IdentityApiService extends BaseService {

    private static _constructor = (async () => {
        BaseService.baseUrl = Config.active.get('identityApiEndpoint');
        BaseService.apiName = 'Identity.Api.Service';
        BaseService.systemAuthToken = await IdentityApiService.authenticateSystemUser();
    })();

    // This will register a user.
    public static async registerUser(body: any): Promise<superagent.Response> {
        // We don't need to add a x-access-token here because the register endpoint is open.
        try {
            let response: superagent.Response = await superagent
                .post(`${super.baseUrl}${CONST.ep.REGISTER}`) 
                .send(body);

            return response;
        }
        catch (err) {
            super.errorHandler(err);
        }
    }

    public static async authenticateSystemUser(): Promise<string>{
        return this.authenticateUser("system@leblum.com", Config.active.get('systemUserPassword'));
    }

    // This will authenticate a user, and return their auth token from the identity api.
    // mostly used for testing purposes.  don't authenticate a user from this microservice.
    public static async authenticateUser(email: string, password: string): Promise<string> {
        // We don't need to add a x-access-token here because the register endpoint is open.
        try {
            let response: superagent.Response = await superagent
                .post(`${super.baseUrl}${CONST.ep.AUTHENTICATE}`) 
                .send({
                    email: email,
                    password: password,
                });

            return response.body.token;
        }
        catch (err) {
            super.errorHandler(err);
        }
    }
}