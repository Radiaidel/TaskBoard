import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CategoryComponent} from "./category/category.component";

const routes: Routes = [
  {path:"Home" , component: DashboardComponent},
  {path: "Tasks" , component: CategoryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
