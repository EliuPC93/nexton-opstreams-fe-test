import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'select',
        pathMatch: 'full'
    },
    {
        path: 'select',
        loadComponent: () => import('./select/select.component').then(c => c.SelectComponent)
    }
];
