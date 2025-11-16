import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperComponent } from './wrapper.component';
import { SectionComponent } from './section/section.component';

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
                component: SectionComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionsRoutingModule {}
