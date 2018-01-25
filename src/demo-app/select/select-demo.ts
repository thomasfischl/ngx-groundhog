import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'select-demo',
  templateUrl: 'select-demo.html',
  styleUrls: ['select-demo.css'],
})
export class SelectDemo implements OnInit {
  options = [
    {
      key: 'Banana',
      label: 'Banana label',
      disabled: false
    },
    {
      key: 'Pear',
      label: 'Pear label',
      disabled: false
    },
    {
      key: 'Apple',
      label: 'Apple label',
      disabled: true
    },
    {
      key: 'Ananas',
      label: 'Ananas label',
      disabled: false
    },
  ];

  ngOnInit() { }
}
