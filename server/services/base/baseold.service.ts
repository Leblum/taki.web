import { Config } from '../../config/config';
import { CONST } from "../../constants";
import log = require('winston');

import * as superagent from "superagent";

export abstract class BaseService {

    protected apiName: string;
    protected baseUrl: string;
    
    protected constructor(){
    }

    public async create(endpoint: string, body: any): Promise<superagent.Response> {
        return await superagent
            .post(`${this.baseUrl}${endpoint}`)
            .set(CONST.TOKEN_HEADER_KEY, Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
            .send(body)
            .catch(err => this.errorHandler(err));

    }

    public async single(endpoint: string, query: any): Promise<superagent.Response> {
        return await superagent
            .post(`${this.baseUrl}${endpoint}${CONST.ep.common.QUERY}`)
            .set(CONST.TOKEN_HEADER_KEY,  Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
            .send(query)
            .catch(err => this.errorHandler(err));
    }

    public async deleteSingle(endpoint: string, queryBody: any): Promise<superagent.Response> {

        let queryResponse = await this.single(endpoint, queryBody);

        // There should be only one model returned by this query, and if we don't get just one back
        // we're not going to delete anything.
        // TODO: I need to figure out how to handle error responses here.
        if (queryResponse.status === 200 && queryResponse.body.length === 1 && queryResponse.body[0]._id) {
            return await superagent
                .delete(`${this.baseUrl}${endpoint}/${queryResponse.body[0]._id}`)
                .set(CONST.TOKEN_HEADER_KEY,  Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
                .catch(err => this.errorHandler(err));

        }
    }

    public async patch(endpoint: string, id: string, partialBody: any): Promise<superagent.Response> {
        return await superagent
            .patch(`${this.baseUrl}${endpoint}/${id}`)
            .set(CONST.TOKEN_HEADER_KEY,  Config.active.get(CONST.SYSTEM_AUTH_TOKEN))
            .send(partialBody)
            .catch(err => this.errorHandler(err));
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
            throw err;
        }
        return null;
    }
}