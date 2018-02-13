import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'progresscircle-demo',
  templateUrl: 'progresscircle-demo.html',
  styleUrls: ['progresscircle-demo.css'],
})
export class ProgresscircleDemo {

  progress = 25;
  min = 0;
  max = 100;
}
