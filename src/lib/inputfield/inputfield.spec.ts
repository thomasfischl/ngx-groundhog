
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {GhInputfieldModule, GhInputfield} from './index';

describe('GhInputfield', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GhInputfieldModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an GhInputfield. */
@Component({
  selector: 'test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `
})
class TestApp {

}
