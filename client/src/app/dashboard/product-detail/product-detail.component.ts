import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/index';
import { IProduct } from '../../../models/index';
import { ErrorEventBus } from '../../../event-buses/error.event-bus';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  public currentProductId: string;
  public cProd: IProduct;

  constructor(private route: ActivatedRoute, private errorEventBus: ErrorEventBus, private productService: ProductService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentProductId = params['id'];
      this.productService.get(this.currentProductId).subscribe( (product: IProduct) =>{
        this.cProd = product;
        console.log(this.cProd);
      },error => {
        this.errorEventBus.throw(error);
      })
    });
  }
}
