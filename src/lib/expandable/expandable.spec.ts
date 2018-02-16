
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {GhExpandableModule, GhExpandable} from './index';

describe('GhExpandable', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GhExpandableModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an GhExpandable. */
@Component({
  selector: 'test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `
})
class TestApp {

}
