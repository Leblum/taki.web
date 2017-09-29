import { Component, OnInit, EventEmitter, Input, ViewChild, OnChanges } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Headers } from '@angular/http';
import * as enums from '../../../enumerations';
import { CONST } from '../../../constants';
import { AlertService } from '../../../services/index';
import { environment } from '../../../environments/environment';
import { IProduct, IProductImage } from '../../../models/index';
import { ActivatedRoute } from '@angular/router';
import { ErrorEventBus } from '../../../event-buses/error.event-bus';
import { ProductService } from '../../../services/product.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NotificationType } from '../../../enumerations';
import { ProductImageEventBus } from '../../../event-buses/index';


@Component({
  selector: 'app-product-image-grid',
  templateUrl: './product-image-grid.component.html',
  styleUrls: ['./product-image-grid.component.css']
})
export class ProductImageGridComponent implements OnChanges {
  @Input() product: IProduct;

  // Images Table properties
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    search: {
      searchPlaceholder: 'Search Products',
      caseInsensitive: true
    }
  };

  public dtTrigger: Subject<any> = new Subject();

  public imageHeaders: string[] = ['Image', 'Url', 'Order', 'Height', 'Width', 'Is Active?', 'Actions']

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private productService: ProductService,
    private alertService: AlertService, private productImageEventBus: ProductImageEventBus) {
  }

  ngOnChanges() {

    // Here the product is being passed in by the parent.  Because of this,
    // we're going to trigger the data table to render whenever the parent changes our product.
    // this might be a performance beast, but we'll see.
    if (this.dtElement && this.dtElement.dtTrigger) {
      this.dtElement.dtTrigger.next();
    }
  }

  filterImages(image: IProductImage) {
    if (image) {
      return image.type === enums.ImageType.thumbnail;
    }
  }

  editImage(order: number) {
   let image = this.product.images.find(image =>{
      return image.order == order;
    });

    this.productImageEventBus.editProductImage(image, this.product);
  }

  deleteImage(order: number) {
    this.productService.deleteProductImageGroup(this.product._id, order).subscribe(response => {
      this.alertService.send({ text: `Product Images removed: ${this.product.displayName}`, notificationType: NotificationType.success }, true);
      let remainingImages = this.product.images.filter((image) => {
        return image.order != order;
      });
      this.product.images = remainingImages;
    });
  }
}
