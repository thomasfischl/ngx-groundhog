import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'select-demo',
  templateUrl: 'select-demo.html',
  styleUrls: ['select-demo.css'],
})
export class SelectDemo implements OnInit {
  currentFruit: string = 'Mango';
  fruits = [
    { key: 'Banana', label: 'Banana label', disabled: false },
    { key: 'Pear', label: 'Pear label', disabled: false },
    { key: 'Apple', label: 'Apple label', disabled: true },
    { key: 'Ananas', label: 'Ananas label', disabled: false },
    { key: 'Blueberry', label: 'Blueberry label', disabled: false },
    { key: 'Orange', label: 'Orange label', disabled: false },
    { key: 'Peach', label: 'Peach label', disabled: false },
    { key: 'Coconut', label: 'Coconut label', disabled: false },
    { key: 'Avocado', label: 'Avocado label', disabled: false },
    { key: 'Cherry', label: 'Cherry label', disabled: false },
    { key: 'Kiwi', label: 'Kiwi label', disabled: false },
    { key: 'Lemon', label: 'Lemon label', disabled: false },
    { key: 'Lime', label: 'Lime label', disabled: false },
    { key: 'Mango', label: 'Mango label', disabled: false },
    { key: 'Olive', label: 'Olive label', disabled: false }
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
