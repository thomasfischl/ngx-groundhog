import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tile-e2e',
  templateUrl: 'tile-e2e.html',
})
export class TileE2E {
  isDisabled: boolean = false;
  clickCounter: number = 0;
}
