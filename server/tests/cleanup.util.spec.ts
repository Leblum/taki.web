//During the test the env variable is set to test
import { Database } from '../config/database/database';
import { App, server } from '../server-entry';
import { Config } from '../config/config';
import mongoose = require('mongoose');

import * as chai from 'chai';
import { CONST } from "../constants";
let expect = chai.expect;
let should = chai.should();
chai.use(require('chai-http'));
import { suite, test, context, } from "mocha-typescript";

export class Cleanup {
    
    public static async clearDatabase() {
        await Database.connect();
        if (process.env.NODE_ENV === 'integration'
            && Database.databaseName.includes('integration')
        ) {
            //await Product.remove({});
        }
        else {
            throw ('The clear database method is trying to be run against a database that isnt integration');
        }
    }
}