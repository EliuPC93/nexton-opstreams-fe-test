import { Routes } from '@angular/router';
import { RouteGuardService } from './services';

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
    {
        path: "summary",
        loadComponent: () => import('./summary/summary.component').then(c => c.SummaryComponent),
		canActivate: [RouteGuardService]
    }
];
