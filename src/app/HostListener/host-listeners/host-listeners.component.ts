import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-host-listeners',
  templateUrl: './host-listeners.component.html',
  styleUrl: './host-listeners.component.css'
})
export class HostListenersComponent {


  @HostListener('click',['$event'])
  show(){
    alert("hello sir")
  }

}
