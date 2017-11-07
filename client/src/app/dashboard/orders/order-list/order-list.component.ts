import { Component, OnInit, NgZone, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { OrderService, AlertService } from '../../../../services/';
import { IOrder } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NotificationType } from '../../../../enumerations';
declare let $: any;
declare let swal: any;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: []
})
export class OrderListComponent implements OnInit {
  public headers: string[] = ['Id', 'Number', 'Code', 'Status', 'Notes','Total', 'Supplier Name', 'Actions']
  public orders: IOrder[];
  public orderTable;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  constructor(public orderService: OrderService, private alertService: AlertService, private errorEventBus: ErrorEventBus, private router: Router) { }

  ngOnInit() {
    this.getOrders(false);

    // This will scroll us back up to the top when you navigate back to this page from detail views.
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerenderDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  createOrder() {
    this.router.navigate(['dashboard/orders/detail/new']);
  }


  approveOrder(order: IOrder) {
    // if (!order.isApproved) {
    //   order.isApproved = true;
    //   this.orderService.update(order, order._id).subscribe(response => {
    //     this.alertService.send({ text: "Order Successfully Approved", notificationType: NotificationType.success });
    //     this.getOrders(false);
    //   });
    // }
    // else {
    //   order.isApproved = false;
    //   this.orderService.update(order, order._id).subscribe(response => {
    //     this.alertService.send({ text: "Order Successfully Un-Approved", notificationType: NotificationType.warning });
    //     this.getOrders(false);
    //   });
    // }
  }

  delete(id: string) {
    swal({
      title: 'Delete this Order?',
      text: "This can't be reverted",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Delete',
      buttonsStyling: false
    }).then(() => {
      // Hit the order service, and delete it.
      this.orderService.delete(id).subscribe((response) => {
        this.alertService.send({ text: "Order Successfully Deleted", notificationType: NotificationType.success });
        this.getOrders(false);
      }, error => {
        this.errorEventBus.throw(error);
      });
    });
  }

  edit(id: string) {
    this.router.navigate(['dashboard/orders/detail/', id]);
  }

  getOrders(notifyUser: boolean) {
    // When this control starts, go get the entities.
    this.orderService.getList<IOrder>().subscribe(orders => {
      this.orders = orders;
      this.rerenderDataTable();
      this.dtOptions = {
        pagingType: 'full_numbers',
        search: {
          searchPlaceholder: 'Search Orders',
          caseInsensitive: true
        }
      };
      if (notifyUser) {
        this.alertService.send({ text: "Order List Refreshed", notificationType: NotificationType.success });
      }
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  refreshOrders() {
    this.getOrders(true);
  }

}
