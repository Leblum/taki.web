import { Config } from "./config";
import { CONST } from "../constants";
import { OrganizationType } from "../enumerations";

import * as identityApi from "superagent";

const util = require('util');
var bcrypt = require('bcrypt');
import log = require('winston');
import { IdentityApiService } from "../services/identity.api.service";

// This is where we're going to bootstrap other services that we need to interact with.
// In this case we're talking to the identity service, and we need to make sure that it has the roles that we need.
export class SupportingServicesBootstrap {

    public static async seed() {
    }

    private static errorHandler(err:any){
        log.error('There was a problem seeding data to the authentication API', {
            identityApiResponse: err && err.response && err.response.body ? err.response.body : err
        });
        throw ({
            message: 'There was a problem seeding data to the authentication API',
            identityApiResponse: err && err.response && err.response.body ? err.response.body : err
        })
    }
}