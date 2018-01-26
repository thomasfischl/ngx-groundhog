import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {GhButtonModule, GhButton} from './index';

describe('GhButton', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GhButtonModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  // Regular button tests
  describe('button[gh-button]', () => {
    it('should handle a click on the button', () => {
      let fixture = TestBed.createComponent(TestApp);
      let testComponent = fixture.debugElement.componentInstance;
      let buttonDebugElement = fixture.debugElement.query(By.css('button'));

      buttonDebugElement.nativeElement.click();
      expect(testComponent.clickCount).toBe(1);
    });

    it('should not increment if disabled', () => {
      let fixture = TestBed.createComponent(TestApp);
      let testComponent = fixture.debugElement.componentInstance;
      let buttonDebugElement = fixture.debugElement.query(By.css('button'));

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();

      expect(testComponent.clickCount).toBe(0);
    });

    it('should disable the native button element', () => {
      let fixture = TestBed.createComponent(TestApp);
      let buttonNativeElement = fixture.nativeElement.querySelector('button');
      expect(buttonNativeElement.disabled).toBeFalsy('Expected button not to be disabled');

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      expect(buttonNativeElement.disabled).toBeTruthy('Expected button to be disabled');
    });
  });

  // Anchor button tests
  describe('a[gh-button]', () => {
    it('should not redirect if disabled', () => {
      let fixture = TestBed.createComponent(TestApp);
      let testComponent = fixture.debugElement.componentInstance;
      let buttonDebugElement = fixture.debugElement.query(By.css('a'));

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();
    });
  });
});

  /** Test component that contains an GhButton. */
@Component({
  selector: 'test-app',
  template: `
    <button gh-button type="button" (click)="increment()"
      [disabled]="isDisabled">
      Go
    </button>
    <a href="http://www.dynatrace.com" gh-button [disabled]="isDisabled">
      Link
    </a>
  `
})
class TestApp {
  clickCount: number = 0;
  isDisabled: boolean = false;
  rippleDisabled: boolean = false;

  increment() {
    this.clickCount++;
  }
}
