import { Routes } from '@angular/router';
import { RouteGuardService } from './route-guard.service';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'select',
        pathMatch: 'full'
    },
    {
        path: 'select',
        loadComponent: () => import('./selection/selection.component').then(c => c.SelectionComponent)
    },
    {
        path: 'questions',
        loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsModule),
		canActivate: [RouteGuardService]
    },
];
