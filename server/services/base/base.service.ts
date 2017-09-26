import { Config } from '../../config/config';
import { CONST } from "../../constants";
import log = require('winston');

import * as superagent from "superagent";
import { IBaseModel } from '../../models/index';
import { RestUrlBuilder, IRestURLConfig } from '../../builders/rest-url.builder';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/frompromise';
import 'rxjs/add/observable/of';
import { Subscription } from 'rxjs/Subscription';

export abstract class BaseService<T extends IBaseModel> {

    protected restUrlBuilder: RestUrlBuilder = new RestUrlBuilder();
    protected apiName: string;
    protected baseUrl: string;
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    public get<T extends IBaseModel>(id: string, query?: any): Observable<T> {
        const url = `${this.baseUrl}${this.endpoint}/${id}`;
        return Observable.fromPromise(
            superagent
                .post(url)
                .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
                .send(query)
        ).map(response => {
            return response.body;
        }).catch(this.observableErrorHandler);
    }

    public getList<T extends IBaseModel>(query?: Object): Observable<T[]> {
        const url = `${this.baseUrl}${this.endpoint}${CONST.ep.common.QUERY}`;
        return Observable.fromPromise(
            superagent
                .get(url)
                .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
                .send(query)
        ).map(response => {
            return response.body;
        }).catch(this.observableErrorHandler);
    }

    delete<T extends IBaseModel>(id: string): Observable<any> {
        const url = `${this.baseUrl}${this.endpoint}/${id}`;
        return Observable.fromPromise(
            superagent
                .delete(url)
                .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
        ).map(response => {
            return response.body;
        }).catch(this.observableErrorHandler);
    }

    deleteMany<T extends IBaseModel>(query: Object): Observable<any> {
        const url = `${this.baseUrl}${this.endpoint}`;
        return Observable.fromPromise(
            superagent
                .delete(url)
                .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
                .send(query)
        ).map(response => {
            return response.body;
        }).catch(this.observableErrorHandler);
    }

    public create<T extends IBaseModel>(T: T): Observable<T> {
        const url = `${this.baseUrl}${this.endpoint}`;
        return Observable.fromPromise(
            superagent
                .post(url)
                .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
                .send(T)
        ).map(response => {
            return response.body;
        }).catch(this.observableErrorHandler);
    }

    update<T extends IBaseModel>(body: any, id: string): Observable<T> {
        const url = `${this.baseUrl}${this.endpoint}/${id}`;
        return Observable.fromPromise(
            superagent
                .patch(url)
                .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
                .send(body)
        ).map(response => {
            return response.body;
        }).catch(this.observableErrorHandler);
    }

    public async createRaw(body: any): Promise<superagent.Response> {
        return await superagent
            .post(`${this.baseUrl}${this.endpoint}`)
            .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
            .send(body)
            .catch(err => this.errorHandler(err));
    }

    // public async query(query: any): Promise<superagent.Response> {
    //     return await superagent
    //         .post(`${this.baseUrl}${this.endpoint}${CONST.ep.common.QUERY}`)
    //         .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
    //         .send(query)
    //         .catch(err => this.errorHandler(err));
    // }

    public deleteSingle(queryBody: any): Subscription {

        return this.getList(queryBody).subscribe((items) =>{
        // There should be only one model returned by this query, and if we don't get just one back
                // we're not going to delete anything.
                if (items.length === 1 && items[0]._id) {
                    return this.delete(items[0]._id);
                }
        });
    }

    public observableErrorHandler(err, caught: Observable<T>) {
        if (err) {
            log.error(`There was an error calling out to the ${this.apiName}`, {
                message: err.message ? err.message : 'null',
                status: err.status ? err.status : 'null',
                url: err.response && err.response.request && err.response.request.url ? err.response.request.url : 'null',
                text: err.response && err.response.text ? err.response.text : 'null',
                description: err.response && err.response.body && err.response.body.description ? err.response.body.description : 'null'
            });
        }
        return Observable.throw(new Error(err));
    }

    public errorHandler(err: any): superagent.Response {
        if (err) {
            log.error(`There was an error calling out to the ${this.apiName}`, {
                message: err.message ? err.message : 'null',
                status: err.status ? err.status : 'null',
                url: err.response && err.response.request && err.response.request.url ? err.response.request.url : 'null',
                text: err.response && err.response.text ? err.response.text : 'null',
                description: err.response && err.response.body && err.response.body.description ? err.response.body.description : 'null'
            });
            //throw err;
        }
        return null;
    }
}