import { Component, OnInit, ViewChild } from '@angular/core';
import { IImage, IImageVariation, IOrder, IOrderItem, IProduct } from '../../../../models/index';
import { OrderItemEventBus } from '../../../../event-buses/index';
import {  NotificationType, OrderItemEventType } from '../../../../enumerations';
import { OrderService, AlertService, ProductService } from '../../../../services/';
import { CompleterData, CompleterCmp, CompleterService } from 'ng2-completer';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

export interface ProductSearchData{
  displayName: string,
  commonName: string,
  id: string, 
}

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: []
})

export class OrderItemDetailComponent implements OnInit, AfterViewInit {

  public order: IOrder;
  public orderItem: IOrderItem;

  // Supplier Type ahead searching
  public searchStr: string;
  public dataService: CompleterData;
  protected searchData: ProductSearchData[];
  protected selectProductId: string;
  @ViewChild("productDDL") public productDropDown: CompleterCmp;

  constructor(
    private orderItemEventBus: OrderItemEventBus,
     private orderService: OrderService,
      private alertService: AlertService,
      private productService: ProductService,
      private completerService: CompleterService,
    ) { }

  ngOnInit() {
    this.orderItemEventBus.orderItemChanged$.subscribe(event => {
      if (event.eventType === OrderItemEventType.edited) {
        this.orderItem = event.orderItem;
        this.order = event.relatedOrder;
      }

      if (this.orderItem && this.orderItem.product) {
        console.log('About to initialize the typeahead drop down for products on order Items.')
        this.productDropDown.value = (this.orderItem.product as IProduct).displayName;
        this.productDropDown.writeValue((this.orderItem.product as IProduct).displayName);
      }
    });

    this.productService.getList().subscribe((products: IProduct[]) =>{
      this.searchData = products.map( product =>{
        return { 
         displayName: product.displayName,
         commonName: product.commonName,
         id: product._id
        }
      });
      this.dataService = this.completerService.local(this.searchData, 'displayName,commonName', 'displayName');    
    });
  }

  ngAfterViewInit(): void {
    console.log('In after view init');

  }

  public onProductSelected(selected: any) {
    console.log('About to set the product ID.')
    if (selected && selected.originalObject && selected.originalObject.id) {
      console.log('Setting the product');
        this.orderItem.product = selected.originalObject.id;
    } else if(this.orderItem && this.orderItem.product){
      console.log('Removing the product ID');
      this.orderItem.product = '';
    }
}

  saveOrderItem(changes: IImage, isValid: boolean) {
    if (isValid) {
      this.order.items.forEach((item) => {
        if (item._id === this.orderItem._id) {
          item = this.orderItem;
        }
      });

      this.orderService.update(this.order, this.order._id).subscribe(response => {
        this.alertService.send({ text: 'Successfully updated order item.', notificationType: NotificationType.success }, true);
      });

      this.orderItemEventBus.saveOrderItem(this.orderItem, this.order);

      // This will basically set the ngIf to false, and hide the control.
      this.orderItem = undefined;
      this.order = undefined;
    }
  }

  cancel() {
    // This will basically set the ngIf to false, and hide the control.
    this.orderItem = undefined;
    this.order = undefined;
  }

}
