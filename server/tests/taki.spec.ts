import { Database } from '../config/database/database';
import { App, server } from '../server-entry';
import { ITokenPayload } from '../models';
import { Config } from '../config/config';
import { CONST } from "../constants";
import { AuthenticationTestUtility, systemAuthToken, productAdminToken, productEditorToken } from "./authentication.util.spec";
import { Cleanup } from "./cleanup.util.spec";
import { suite, test } from "mocha-typescript";
import { DatabaseBootstrap } from "../config/database/database-bootstrap";

import * as supertest from 'supertest';
import * as chai from 'chai';

const api = supertest.agent(App.server);
const mongoose = require("mongoose");
const expect = chai.expect;
const should = chai.should();

@suite('Taki Startup Test -> ')
class TakiStartupTest {

    // First we need to get some users to work with from the identity service
    public static before(done) {
        App.server.on('dbConnected', async () => {
            await Cleanup.clearDatabase();
            await DatabaseBootstrap.seed();

            // This will create, 2 users, an organization, and add the users to the correct roles.
            await AuthenticationTestUtility.createIdentityApiTestData();
            done();
        });
    }

    public static async after() {
        await Cleanup.clearDatabase();
    }

    @test('Just setting up a test for testing initialization')
    public async initialize() {
        expect(1).to.be.equal(1);
        return;
    }
}
