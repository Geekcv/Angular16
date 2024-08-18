import { Component } from '@angular/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent {

  name="abhishek"
  age ="21"

  show(){
    console.log("show funtion")
  }

  data:String='without ngmodule'

  data1:String='with ngmodule'

}
