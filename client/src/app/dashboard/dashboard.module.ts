import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { OverviewComponent } from './overview/overview.component';
import { DashboardRoutes } from './dashboard.routing';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ImageUploaderModule } from '../shared/image-uploader/image-uploader.module'
import { CallbackFilterPipe } from '../pipes/callback-filter.pipe';
import { NgUploaderModule } from 'ngx-uploader';
import { ProductImageGridComponent } from './product-image-grid/product-image-grid.component';
import { ProductImageDetailComponent } from './product-image-detail/product-image-detail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        DataTablesModule,
        ImageUploaderModule,
        NgUploaderModule
    ],
    declarations: [
        OverviewComponent, 
        ProductListComponent, 
        ProductDetailComponent, 
        CallbackFilterPipe, ProductImageGridComponent, ProductImageDetailComponent
    ]
})

export class DashboardModule { }
