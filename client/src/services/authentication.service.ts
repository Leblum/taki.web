import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { BaseService } from './base/base.service';
import { CONST } from '../constants';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class AuthenticationService extends BaseService{
    constructor(public http: Http) {
        super(http);
     }
 
    login(email: string, password: string): Observable<Response> {
        return super.post(CONST.ep.AUTHENTICATE,{ email: email, password: password } ).map((response: Response) => {
            // login successful if there's a jwt token in the response
            let user = response.json();
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // we're going to take on email to the 'token' so we can display it.
                let tokenObj = jwtDecode(user.token);
                tokenObj.email = email;
                localStorage.setItem(CONST.CLIENT_TOKEN_LOCATION, JSON.stringify(tokenObj));
                console.log(JSON.stringify(tokenObj));
            }
            return user;
        });
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(CONST.CLIENT_TOKEN_LOCATION);
    }
}