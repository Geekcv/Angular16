import { Component } from '@angular/core';
import { Viewproviders } from '../viewproviders';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
  viewProviders:[Viewproviders]
})
export class ViewComponent {

  constructor(private _obj:Viewproviders){
    _obj.showP()
  }

}
