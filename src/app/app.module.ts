import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './componets/employee/employee.component';
import { StudentsComponent } from './componets/students/students.component';
import { StudentModule } from './lazy-load/student/student.module';
import { DecoratorsComponent } from './Decorator/decorators/decorators.component';
import { HostListenersComponent } from './HostListener/host-listeners/host-listeners.component';
import { Viewproviders } from './view-provider/viewproviders';
import { ViewComponent } from './view-provider/view/view.component';
import { DirectivesComponent } from './directive/directives/directives.component';
import { DataComponent } from './DataBinding/data/data.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    StudentsComponent,
    DecoratorsComponent,
    HostListenersComponent,
    ViewComponent,
    DirectivesComponent,
    DataComponent   // always put componets name
  ],
  imports: [
    BrowserModule,   // alwayes put module name
    AppRoutingModule,
    FormsModule
  ],
  providers: [Viewproviders],    // alwayes put servies and class name
  bootstrap: [AppComponent]    //booting process which componets load first
})
export class AppModule { 
  constructor(){
    console.log("AppModule")
  }
}
