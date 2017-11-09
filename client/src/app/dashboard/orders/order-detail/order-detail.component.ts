import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { OrderService, AlertService, WooCommerceService } from '../../../../services/index';
import { IOrder,IEmail } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/error.event-bus';
import * as enums from '../../../../enumerations';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Customer, Order } from '../../../../models/woo/index';
declare var $: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
// Commentary
  public currentOrderId: string;
  public order: IOrder;
  public wooCustomer: Customer;
  public wooOrder: Order;
  public wooProductHeaders:string[] = ['Name', 'Product ID', 'Price', 'Quantity', 'Total'];

  public selectPickerNeedsStartup: boolean = true;
  public orderStatuses = enums.EnumHelper.getSelectors(enums.OrderStatus);
  //public currentOrderStatus = this.order && this.order.status ? this.order.status : enums.OrderStatus.entered;

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private orderService: OrderService,
    private alertService: AlertService,
    private wooService: WooCommerceService
  ) {
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
      if(this.order && this.order.wooOrderNumber){
        this.getWooCommerceDetails();
      }
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

  getWooCommerceDetails(){
    this.wooService.getOrder(Number(this.order.wooOrderNumber))
    .map(wooOrder =>{
      this.order.total = Number(wooOrder.total);
      this.order.tax = Number(wooOrder.total_tax);
      this.wooOrder = wooOrder;
      if(this.wooOrder.line_items && this.wooOrder.line_items.length > 0){
        for (let i = 0; i < this.wooOrder.line_items.length; i++) {
          let lineItem = this.wooOrder.line_items[i];
          //Now we're going to go fetch the product images for our grid.
          const wooProduct = this.wooService.getProduct(lineItem.product_id).subscribe()
        }
      }

      return wooOrder;
    })
    .flatMap(wooOrder =>{
      console.log('About to fetch customer');
      if(wooOrder && wooOrder.customer_id){
        console.log('Fetching customer');
        this.order.wooCustomerId = wooOrder.customer_id.toString();
        return this.wooService.getCustomer(wooOrder.customer_id)
      }
    })
    .subscribe(wooCustomer => {
      this.wooCustomer = wooCustomer;
    }, error => {this.errorEventBus.throw(error)});
  }

  priate 

  ngAfterViewChecked() {
    if (this.selectPickerNeedsStartup) {
      $('.selectpicker').selectpicker('refresh');
      this.selectPickerNeedsStartup = false;
    }
  }

}
