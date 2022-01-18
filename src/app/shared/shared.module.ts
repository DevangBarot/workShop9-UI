import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { EditorComponent } from './components/editor/editor.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { DateTimeComponent } from './components/date-time/date-time.component';

export function momentAdapterFactory() {
    return adapterFactory(moment);
  };


@NgModule({
  declarations: [
    SideBarComponent,
    HeaderComponent,
    AppFooterComponent,
    CalendarComponent,
    EditorComponent,
    DataTableComponent,
    SearchPanelComponent,
    MomentDatePipe,
    DateTimeComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    AngularEditorModule,
    HttpClientModule,
    NgbModalModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    NgxPaginationModule
  ],
  exports:[
    SideBarComponent,
    HeaderComponent,
    AppFooterComponent,
    CalendarComponent,
    EditorComponent,
    DataTableComponent,
    SearchPanelComponent,
    NgxPaginationModule,
    MomentDatePipe,
    FontAwesomeModule,
    AngularEditorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
