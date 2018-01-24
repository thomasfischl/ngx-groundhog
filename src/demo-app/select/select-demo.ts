import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'select-demo',
  templateUrl: 'select-demo.html',
  styleUrls: ['select-demo.css'],
})
export class SelectDemo implements OnInit {
  demoPlaceholder = 'Please select value';
  options = [
    {
      key: 'Banana',
      label: 'Banana label',
    },
    {
      key: 'Pear',
      label: 'Pear label',
    },
    {
      key: 'Apple',
      label: 'Apple label',
    },
    {
      key: 'Ananas',
      label: 'Ananas label',
    },
  ];

  ngOnInit() { }
}
