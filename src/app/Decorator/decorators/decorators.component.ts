import { Component } from '@angular/core';

class abc{
  constructor(){
    console.log("abc")
  }
}

@Component({
  selector: 'app-decorators',
  templateUrl: './decorators.component.html',
  styleUrl: './decorators.component.css'
})
export class DecoratorsComponent {

  constructor(){
    console.log("DecoratorsComponent")
  }

}
