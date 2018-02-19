import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'input-demo',
  templateUrl: 'input-demo.html',
  styleUrls: ['input-demo.css'],
})
export class InputDemo {
  emailValue: string = '';
  emailDisabled = false;
}
