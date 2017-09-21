import { Component, OnInit, NgZone, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/index';
import { IProduct } from '../../../models/index';
import { ErrorEventBus } from '../../../event-buses/error.event-bus';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare let $: any;

declare interface Headers {
  headerRow: string[];
  footerRow: string[];
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products: IProduct[];
  public productTable;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  public tableHeaders : Headers = {
    headerRow: ['Id', 'Display Name', 'Is Template?', 'Created At', 'Updated At', 'Actions'],
    footerRow: ['Id', 'Display Name', 'Is Template?', 'Created At', 'Updated At', 'Actions']
  };

  constructor(public productService: ProductService, private errorEventBus: ErrorEventBus, private router: Router) { }

  ngOnInit() {

    // When this control starts, go get the entities.
    this.productService.getList<IProduct>().subscribe(products => {
      this.products = products;
      this.rerender();
      this.dtOptions = {
        pagingType: 'full_numbers'
      };
    }, error => {
      this.errorEventBus.throw(error);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  createProduct() {
    this.router.navigate(['dashboard/products/detail?new=true']);
  }
   

    // // Iniitialize the table.
    // let table = $('#datatables').DataTable();

    // // Setup handlers for the table actions.
    // // Edit record
    // table.on('click', '.edit', function () {
    //   let $tr = $(this).closest('tr');

    //   let data = table.row($tr).data();
    //   alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
    // });

    // // Delete a record
    // table.on('click', '.remove', function (e) {
    //   let $tr = $(this).closest('tr');
    //   table.row($tr).remove().draw();
    //   e.preventDefault();
    // });

    // //Like record
    // table.on('click', '.like', function () {
    //   alert('You clicked on Like button');
    // });

    // // If the table is not empty then hide the empty row
    // if(this.products.length > 0){
    //   $('.dataTables_empty').hide();
    // }
}