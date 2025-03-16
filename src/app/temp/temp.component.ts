import { Component } from '@angular/core';

@Component({
  selector: 'app-temp',
  imports: [],
  templateUrl: './temp.component.html',
  styleUrl: './temp.component.css'
})
export class TempComponent  {



addsum(){

  let b = 5
  let c = 3
  let total = b+c
  alert(total)
  
}

}
