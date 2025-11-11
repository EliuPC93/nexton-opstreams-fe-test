import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'select',
        pathMatch: 'full'
    },
    {
        path: 'select',
        loadComponent: () => import('./selection/selection.component').then(c => c.SelectionComponent)
    }
];
