import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListComponent,
    AddEditComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BlogsModule { }
