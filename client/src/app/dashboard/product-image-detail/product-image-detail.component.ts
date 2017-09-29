import { Component, OnInit } from '@angular/core';
import { IProductImage, IProduct } from '../../../models/index';
import { ProductImageEventBus } from '../../../event-buses/index';
import { ProductImageEventType } from '../../../enumerations';
import { ProductService } from '../../../services/';

@Component({
  selector: 'app-product-image-detail',
  templateUrl: './product-image-detail.component.html',
  styleUrls: ['./product-image-detail.component.css']
})
export class ProductImageDetailComponent implements OnInit {

  public image: IProductImage;
  public product: IProduct;

  constructor(private imageEventBus: ProductImageEventBus, private productService: ProductService) { }

  ngOnInit() {
    this.imageEventBus.productImageChanged$.subscribe(event => {
      if (event.eventType === ProductImageEventType.edited) {
        this.image = event.productImage;
        this.product = event.relatedProduct;
      }
    })
  }

  saveImage(changes: IProductImage, isValid: boolean) {
    if (isValid) {
      // We really need to take and apply this to any of the images in this same group.
      // find the imageId on the product.
      let oldImage = this.product.images.find(image => {
        return image._id == image._id;
      });
      // So now I have the old image, we're going to apply the changes to any of the images on the product.
      // grab all the images by order.

      let imagesToChange = this.product.images.filter(image => {
        return image.order == oldImage.order;
      });

      imagesToChange.forEach(image => {
        image.order = image.order;
        image.isActive = image.isActive;
      });
    }
  }

}
