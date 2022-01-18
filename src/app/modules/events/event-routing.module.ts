import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddEditComponent } from "./add-edit/add-edit.component";
import { ListComponent } from "./list/list.component";

const routes: Routes = [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'list',
      component: ListComponent
    },
    {
      path: 'create',
      component: AddEditComponent
    },
    {
      path: 'update/:id', 
      component: AddEditComponent
    },
    { path: '**', redirectTo: '' },
    // {
    //   path: 'view/:id',
    //   component: ViewComponent,
    //   children: [
    //     { path : '', redirectTo: 'overview', pathMatch: 'full'},
    //     { path: 'overview', component: OverviewComponent},
    //     { path: 'invoice', component: InvoiceComponent},
    //     { path: 'documents', component: DocumentsComponent},
    //     { path: 'bol', component: BolComponent },
    //     { path: 'pod', component: PodComponent },
    //     { path: 'tracking', component: TrackingComponent },
    //     { path: 'live-tracking', component: LiveTrackingComponent },
       
    //   ]
      
    // }
  ]
    
  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class EventRoutingModule { }