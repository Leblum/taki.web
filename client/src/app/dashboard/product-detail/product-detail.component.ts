import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, AlertService } from '../../../services/index';
import { IProduct } from '../../../models/index';
import { ErrorEventBus } from '../../../event-buses/error.event-bus';
import { ProductType, EnumHelper, NotificationType } from '../../../enumerations';
declare var $: any;


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  public currentProductId: string;
  public cProd: IProduct;
  public selectPickerNeedsStartup: boolean;
  public tagsToAdd: string = '';

  public productTypes = EnumHelper.getSelectors(ProductType);

  constructor(private route: ActivatedRoute,
    private errorEventBus: ErrorEventBus,
    private productService: ProductService,
    private alertService: AlertService, ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentProductId = params['id'];
      this.productService.get(this.currentProductId).subscribe((product: IProduct) => {

        this.cProd = product;
        console.log(product.type);
        this.selectPickerNeedsStartup = true;

        //  Init Bootstrap Select Picker
        $(".selectpicker").selectpicker({
          iconBase: "ti",
          tickIcon: "ti-check"
        });
      }, error => {
        this.errorEventBus.throw(error);
      });
    });
  }

  saveProduct(changes: IProduct, isValid: boolean) {
    if (isValid) {
      if (!this.isTagInputEmpty()) {
        this.alertService.send({
          text: `Product not saved, because tags were present, that weren't added. Add them before saving.`,
          notificationType: NotificationType.warning
        }, true);
      }
      else {
        this.productService.update(this.cProd, this.cProd._id).subscribe(response => {

          console.log(`Saved Product ${this.cProd._id}`);

          this.alertService.send({ text: `Product saved: ${this.cProd.displayName}`, notificationType: NotificationType.success }, true);

        }, error => {
          this.errorEventBus.throw(error);
        });
      }
    }
  }

  ngAfterViewChecked() {
    if (this.selectPickerNeedsStartup) {
      $('.selectpicker').selectpicker('refresh');
      this.selectPickerNeedsStartup = false;
    }
  }

  removeTag(tag: string): void {
    let tagIndex = this.cProd.tags.indexOf(tag);
    this.cProd.tags.splice(tagIndex, 1);
  }

  isTagInputEmpty(): boolean {
    return (this.getTrimmedTags().length === 0);
  }

  addTags() {
    this.cProd.tags = this.cProd.tags.concat(this.getTrimmedTags());
    this.tagsToAdd = '';
  }

  getTrimmedTags(): string[] {
    let tagsFromInput = this.tagsToAdd.split(',');
    tagsFromInput = tagsFromInput.filter(tag =>{
      return tag.trim().toLowerCase().length > 0;
    })

    return tagsFromInput;
  }
}
