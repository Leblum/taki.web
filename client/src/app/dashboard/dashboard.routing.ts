import { Routes } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { StatsComponent } from './stats/stats.component';

export const DashboardRoutes: Routes = [{
    path: '',
    component: OverviewComponent,
    children: [{
        path: 'overview',
        component: OverviewComponent
    },{
        path: 'stats',
        component: StatsComponent
    }]
}];
