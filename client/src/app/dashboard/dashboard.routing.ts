import { Routes } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { ProductListComponent } from './product-list/product-list.component';

export const DashboardRoutes: Routes = [{
    path: '',
    component: OverviewComponent,
    children: [{
        path: 'overview',
        component: OverviewComponent
    }]
},
{
    path: 'products/list',
    component: ProductListComponent,
}
];
