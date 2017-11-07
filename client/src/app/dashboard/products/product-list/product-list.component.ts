import { Component, OnInit, NgZone, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { ProductService, AlertService } from '../../../../services/';
import { IProduct } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NotificationType } from '../../../../enumerations';
declare let $: any;
declare let swal: any;


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public headers: string[] = ['Id', 'Display Name', 'Is Template?', 'Created At', 'Updated At', 'Actions']
  public products: IProduct[];
  public productTable;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  constructor(public productService: ProductService, private alertService: AlertService, private errorEventBus: ErrorEventBus, private router: Router) { }

  ngOnInit() {
    this.getProducts(false);
    
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

  createProduct() {
    this.router.navigate(['dashboard/products/detail/new']);
  }

  delete(id: string) {
    swal({
      title: 'Delete this Product?',
      text: "This can't be reverted",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Delete',
      buttonsStyling: false
    }).then(() => {
      // Hit the product service, and delete it.
      this.productService.delete(id).subscribe((response) => {
        this.alertService.send({ text: "Product Successfully Deleted", notificationType: NotificationType.success });
        this.getProducts(false);
      }, error => {
        this.errorEventBus.throw(error);
      });
    });
  }

  edit(id: string) {
    this.router.navigate(['dashboard/products/detail/', id]);
  }

  getProducts(notifyUser: boolean) {
    // When this control starts, go get the entities.
    this.productService.getList<IProduct>().subscribe(products => {
      this.products = products;
      this.rerenderDataTable();
      this.dtOptions = {
        pagingType: 'full_numbers',
        search: {
          searchPlaceholder: 'Search Products',
          caseInsensitive: true
        }
      };
      if (notifyUser) {
        this.alertService.send({ text: "Product List Refreshed", notificationType: NotificationType.success });
      }
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  refreshProducts() {
    this.getProducts(true);
  }
}
