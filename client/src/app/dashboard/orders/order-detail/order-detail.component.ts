import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { OrderService, AlertService } from '../../../../services/index';
import { IOrder,IEmail } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/error.event-bus';
import * as enums from '../../../../enumerations';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
declare var $: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: []
})
export class OrderDetailComponent implements OnInit {
// Commentary
  public currentOrderId: string;
  public order: IOrder;

  public selectPickerNeedsStartup: boolean = true;
  public orderStatuses = enums.EnumHelper.getSelectors(enums.OrderStatus);
  //public currentOrderStatus = this.order && this.order.status ? this.order.status : enums.OrderStatus.entered;

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private orderService: OrderService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // if there isn't an id then it's a new order.
      if (params['id']) {
        this.currentOrderId = params['id'];
        this.fetchOrder();
      }
      else {
        this.order = {
           status: enums.OrderStatus.entered,
        };
        this.order.items = [];
      }
    });
  }

  fetchOrder() {
    this.orderService.get(this.currentOrderId).subscribe((order: IOrder) => {
      // If they came back from the API as undefined we have to set them, otherwise the onChange bindings won't work.
      if(order && order.items == undefined){
        order.items = [];
      }

      this.selectPickerNeedsStartup = true;
      //  Init Bootstrap Select Picker
      $(".selectpicker").selectpicker({
        iconBase: "ti",
        tickIcon: "ti-check"
      });

      this.order = order;
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  saveOrder(changes: IOrder, isValid: boolean) {
    if (isValid) {
      // This is for when we're trying to create a new order.
      if (this.order._id === undefined) {
        this.orderService.create(this.order).subscribe(response => {
          this.order = response;
          this.currentOrderId = this.order._id;
          this.alertService.send({ text: `Order created: ${this.order.code}`, notificationType: enums.NotificationType.success }, true);
        }, error => {
          this.errorEventBus.throw(error);
        });
      }
      // This is for when we're saving an existing order.
      else {
        this.orderService.update(this.order, this.order._id).subscribe(response => {

          console.log(`Saved Order ${this.order._id}`);

          this.alertService.send({ text: `Order saved: ${this.order.code}`, notificationType: enums.NotificationType.success }, true);

        }, error => {
          this.errorEventBus.throw(error);
        });
      }
    }
  }

  ngAfterViewChecked() {
    if (this.selectPickerNeedsStartup) {
      $('.selectpicker').selectpicker('refresh');
      this.selectPickerNeedsStartup = false;
    }
  }

}
