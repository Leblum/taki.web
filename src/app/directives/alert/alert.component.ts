import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/';
import { IMessage } from '../../../classes/message.interface';
import { NotificationType } from '../../../enumerations';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => {
            if (message) {
                $.notify({
                    icon: this.calculateIcon(message),
                    message: message.text
                }, {
                        type: NotificationType[message.notificationType],
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });
            }
        });
    }

    calculateIcon(message: IMessage) {
        if (message && message.notificationType) {
            switch (+message.notificationType) {
                case NotificationType.danger:
                    return "ti-alert";
                case NotificationType.info:
                    return "ti-info";
                case NotificationType.warning:
                    return "ti-bell";
                case NotificationType.success:
                    return "ti-check";
                default:
                    break;
            }
        }
        return '';
    }
}