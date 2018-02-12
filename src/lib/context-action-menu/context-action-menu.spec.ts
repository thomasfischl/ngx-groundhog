
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {GhContextActionMenuModule, GhContextActionMenu} from './index';

describe('GhContextActionMenu', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GhContextActionMenuModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an GhContextActionMenu. */
@Component({
  selector: 'test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `
})
class TestApp {

}
