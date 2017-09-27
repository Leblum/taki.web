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
                        delay: this.calculateTimerDelay(message),
                        timer: this.calculateTimerDelay(message),
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });
            }
        });
    }

    calculateTimerDelay(message: IMessage): number{
        if (message && message.notificationType) {
            switch (+message.notificationType) {
                case NotificationType.danger:
                    return 5000;
                case NotificationType.info:
                    return 1000;
                case NotificationType.warning:
                    return 5000;
                case NotificationType.success:
                    return 1000;
                default:
                    return 1000;
            }
        }
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