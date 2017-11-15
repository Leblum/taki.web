import { Component, OnInit, NgZone, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProductService, AlertService } from '../../../../services/';
import { IProduct } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
//import { DataTableDirective } from 'angular-datatables';
import { NotificationType } from '../../../../enumerations';
import 'datatables.net'
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

  // *************  New Way of doing data Table.
  private productsTable: any;
  private tableWidget: DataTables.Api;

  // ********************

  public isForTemplates: boolean = false;

  constructor(
    public productService: ProductService,
    private alertService: AlertService,
    private errorEventBus: ErrorEventBus,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef // You need this in order to be able to "grab" the table element form the DOM
  ) {

  }

  ngOnInit() {
    this.getProducts(false);
    // This will scroll us back up to the top when you navigate back to this page from detail views.
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  loadDataTable(){
    if (this.tableWidget) {
      this.tableWidget.destroy(false); // essentially refreshes the table
    }

    let tableOptions: DataTables.Settings = {
        data: this.products,
        pagingType: 'full_numbers',
        search: {
          searchPlaceholder: 'Search Products',
          caseInsensitive: true
        }
    };
    this.productsTable = $(this.el.nativeElement.querySelector('table'));
    console.dir(this.productsTable);

    this.tableWidget = this.productsTable.DataTable(tableOptions);
    console.dir(this.tableWidget);
  }

  createProductFromTemplate(id: string){
    this.productService.createActiveProductFromTemplate(id).subscribe(newProduct =>{
      this.edit(newProduct._id);
    });
  }

  newProductTemplate() {
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
    // When this control starts, go get the products.
    this.productService.getList<IProduct>().subscribe(productsFromApi => {
      this.route.paramMap.subscribe(paramMap =>{
        this.isForTemplates = (paramMap.get('isTemplate') == 'true');
        // We're going to filter products based on whether they are a template or not which is on the url.
        this.products = productsFromApi.filter(productForFilter =>{
          return productForFilter.isTemplate == this.isForTemplates;
        });

        // No matter what I tried, I couldn't seem to get the data tables.net to work.
        // if you want to continue to try this, you can uncomment this line.
        //this.loadDataTable();

        if (notifyUser) {
          this.alertService.send({ text: "Product List Refreshed", notificationType: NotificationType.success });
        }
      });
    }
    , error => {
      this.errorEventBus.throw(error);
    });
  }

  refreshProducts() {
    this.getProducts(true);
  }
}
