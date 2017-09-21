import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { OverviewComponent } from './overview/overview.component';
import { DashboardRoutes } from './dashboard.routing';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        DataTablesModule
    ],
    declarations: [OverviewComponent, ProductListComponent]
})

export class DashboardModule {}
