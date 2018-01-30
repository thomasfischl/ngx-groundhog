import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'select-demo',
  templateUrl: 'select-demo.html',
  styleUrls: ['select-demo.css'],
})
export class SelectDemo implements OnInit {
  currentFruit: string;
  fruits = [
    { key: 'Banana', label: 'Banana label', disabled: false },
    { key: 'Pear', label: 'Pear label', disabled: false },
    { key: 'Apple', label: 'Apple label', disabled: true },
    { key: 'Ananas', label: 'Ananas label', disabled: false }
  ];

  currentDrink: string;
  drinkDisabled = false;
  drinks = [
    { key: 'Beer', label: 'Beer label', disabled: false },
    { key: 'Wine', label: 'wine label', disabled: false },
    { key: 'Mojito', label: 'Mojito label', disabled: true },
    { key: 'Shake', label: 'Shake label', disabled: false }
  ];

  ngOnInit() { }

  log(value: any) { console.log(value); }
}
