import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'datepicker-demo',
  templateUrl: 'datepicker-demo.html',
  styleUrls: ['datepicker-demo.css'],
})
export class DatepickerDemo {
  currentDate1 = new Date();

  _selectedChange(d: Date) {
    this.currentDate1 = d;
  }
}

