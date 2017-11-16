import { Component, OnInit, NgZone, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProductService, AlertService, SupplierService } from '../../../../services/';
import { IProduct, IImage } from '../../../../models/index';
import { ErrorEventBus } from '../../../../event-buses/';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import * as enums from '../../../../enumerations';
//import { DataTableDirective } from 'angular-datatables';
import { NotificationType } from '../../../../enumerations';
import 'datatables.net'
import { forEach } from '@angular/router/src/utils/collection';
declare let $: any;
declare let swal: any;


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public templateHeaders: string[] = ['Id', 'Display Name', 'Is Template?', 'Created At', 'Updated At', 'Actions'];
  public activeProductHeaders: string[] = ['Id', 'Display Name', 'Supplied By', 'Price per Stem', 'Stems Per Bundle', 'Actions'];
  public products: IProduct[];

  // *************  New Way of doing data Table.
  private productsTable: any;
  private tableWidget: DataTables.Api;

  // ********************

  public isTemplate: boolean = false;

  constructor(
    public productService: ProductService,
    private alertService: AlertService,
    private errorEventBus: ErrorEventBus,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef, // You need this in order to be able to "grab" the table element form the DOM
    private supplierService: SupplierService
  ) {

  }

  ngOnInit() {
    console.log('in ngOnInit for product list');
    this.getProducts(false);
    // This will scroll us back up to the top when you navigate back to this page from detail views.
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
      window.scrollTo(0, 0);
    });
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
    this.route.paramMap.map(paramMap =>{
      this.isTemplate = (paramMap.get('isTemplate') == 'true');
      return this.isTemplate
    }).flatMap(isTemplate=>{
      return this.productService.query<IProduct>({
        isTemplate: isTemplate
      });
    }).subscribe(products=>{
      this.products = products;
      
      this.setupImages();

      if (notifyUser) {
        this.alertService.send({ text: "Product List Refreshed", notificationType: NotificationType.success });
      }
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  setupImages(){
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if(product.images && product.images.length > 0){
        // If we sort the product images on order, now we can just pull the lowest order image.
        product.images = product.images.sort((a, b)=>{
          return a.order - b.order;
        });
  
        product.thumbnailUrl = this.getThumbnailUrl(product.images[0]);
      }
    }
  }

  getThumbnailUrl(image:IImage):string{
    if (image) {
      for (let i = 0; i < image.variations.length; i++) {
        const variation = image.variations[i];
        if(variation.type === enums.ImageType.thumbnail){
          return variation.url;
        }
      }
    }
    return '';
  }

  refreshProducts() {
    this.getProducts(true);
  }

  // loadDataTable(){
  //   if (this.tableWidget) {
  //     this.tableWidget.destroy(false); // essentially refreshes the table
  //   }

  //   let tableOptions: DataTables.Settings = {
  //       data: this.products,
  //       pagingType: 'full_numbers',
  //       search: {
  //         searchPlaceholder: 'Search Products',
  //         caseInsensitive: true
  //       }
  //   };
  //   this.productsTable = $(this.el.nativeElement.querySelector('table'));
  //   console.dir(this.productsTable);

  //   this.tableWidget = this.productsTable.DataTable(tableOptions);
  //   console.dir(this.tableWidget);
  // }
}
