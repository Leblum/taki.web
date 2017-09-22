import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/index';
import { IProduct } from '../../../models/index';
import { ErrorEventBus } from '../../../event-buses/error.event-bus';
import { ProductType, EnumHelper } from '../../../enumerations';
declare var $:any;


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  public currentProductId: string;
  public cProd: IProduct;
  public selectPickerNeedsStartup: boolean;

  public productTypes = EnumHelper.getSelectors(ProductType);

  constructor(private route: ActivatedRoute, private errorEventBus: ErrorEventBus, private productService: ProductService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentProductId = params['id'];
      this.productService.get(this.currentProductId).subscribe( (product: IProduct) =>{
        this.cProd = product;
        console.log(product.type);
        this.selectPickerNeedsStartup = true;

        //  Init Bootstrap Select Picker
          $(".selectpicker").selectpicker({
              iconBase: "ti",
              tickIcon: "ti-check"
          });
      },error => {
        this.errorEventBus.throw(error);
      })
    });
  }

  saveProduct(value: IProduct, isValid: boolean){
    if(isValid){
      console.log(value);
      console.log(this.cProd);
    }
  }

  ngAfterViewChecked() {
    if(this.selectPickerNeedsStartup){
      $('.selectpicker').selectpicker('refresh');
      this.selectPickerNeedsStartup = false;
    }
  }

  removeTag(tag:string): void{
    let tagIndex = this.cProd.tags.indexOf(tag);
    this.cProd.tags.splice(tagIndex,1);
  }
}
