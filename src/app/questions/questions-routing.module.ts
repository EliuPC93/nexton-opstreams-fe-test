import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperComponent } from './wrapper.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "1",
        pathMatch: "prefix"
    },
    {
        path: "", component: WrapperComponent,
        children: [
            {
                path: ":section",
                loadComponent: () => import("./section/section.component").then(c => c.SectionComponent),
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionsRoutingModule {}
