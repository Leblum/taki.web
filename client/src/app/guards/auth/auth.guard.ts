import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CONST } from '../../../constants';
import { AlertService } from '../../../services/index';
import { NotificationType } from '../../../enumerations';

@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router, private alertService: AlertService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) {
            let token = JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION));

            if(token && token.roles && token.roles.indexOf('admin') >= 0){
                return true;
            }   
            // logged in so return true
            this.alertService.send({text: "Only admins are allowed in", notificationType: NotificationType.danger}, true);
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
 
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}