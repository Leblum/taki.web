import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { IMessage } from '../classes/message.interface';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;
 
    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }
 
    send(message: IMessage, showAfterNavigationChange = false) {
        this.keepAfterNavigationChange = showAfterNavigationChange;
        this.subject.next(message);
    }

    getMessage(): Observable<IMessage> {
        return this.subject.asObservable();
    }
}