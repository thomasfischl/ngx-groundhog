import { TestBed, async } from '@angular/core/testing';
import { GhTileModule, GhTile } from './index';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
describe('GhTile', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GhTileModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));
  it('should handle a click on the tile', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const tileDebugElement = fixture.debugElement.query(By.css('gh-tile'));

    tileDebugElement.nativeElement.click();
    expect(testComponent.clickCount).toBe(1);
  });

  // TODO @thomaspink: investigate this; .click() triggers even if we call preventDefault()
  // it('should not increment if disabled', () => {
  //   const fixture = TestBed.createComponent(TestApp);
  //   const testComponent = fixture.debugElement.componentInstance;
  //   const tileDebugElement = fixture.debugElement.query(By.css('gh-tile'));

  //   testComponent.isDisabled = true;
  //   fixture.detectChanges();

  //   tileDebugElement.nativeElement.click();

  //   expect(testComponent.clickCount).toBe(0);
  // });

  it('should add a disabled class to the tile element', () => {
    const fixture = TestBed.createComponent(TestApp);
    const tileNativeElement = fixture.nativeElement.querySelector('gh-tile');
    expect(tileNativeElement.classList.contains('gh-tile-disabled'))
      .toBeFalsy('Expected tile not to be disabled');

    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();
    expect(tileNativeElement.classList.contains('gh-tile-disabled'))
      .toBeTruthy('Expected tile to be disabled');
  });

  it('should add aria-disabled attribute if disabled', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const tileDebugElement = fixture.debugElement.query(By.css('gh-tile'));
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('false');

    testComponent.isDisabled = true;
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('should not add aria-disabled attribute if disabled is false', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const tileDebugElement = fixture.debugElement.query(By.css('gh-tile'));
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled'))
      .toBe('false', 'Expect aria-disabled="false"');
    expect(tileDebugElement.nativeElement.getAttribute('disabled'))
      .toBeNull('Expect disabled="false"');

    testComponent.isDisabled = false;
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled'))
      .toBe('false', 'Expect no aria-disabled');
    expect(tileDebugElement.nativeElement.getAttribute('disabled'))
      .toBeNull('Expect no disabled');
  });

  it('should augment an existing class with a color property', () => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();

    const tileElement = fixture.debugElement.query(By.css('gh-tile'));
    const instance = tileElement.componentInstance;

    expect(instance.color)
      .toBe('main', 'Expected the mixed-into class to have a color property');

    instance.color = 'accent';

    expect(instance.color)
        .toBe('accent', 'Expected the mixed-into class to have an updated color property');
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();

    const tileElement = fixture.debugElement.query(By.css('gh-tile'));
    const instance = tileElement.componentInstance;

    expect(tileElement.nativeElement.classList)
      .toContain('gh-main', 'Expected the element to have the "gh-main" class set');

    instance.color = 'accent';

    expect(tileElement.nativeElement.classList).not.toContain('gh-main',
      'Expected the element to no longer have "gh-main" set.');
    expect(tileElement.nativeElement.classList).toContain('gh-accent',
      'Expected the element to have the "gh-accent" class set');
  });
});

/** Test component that contains an GhTile. */
@Component({
  selector: 'test-app',
  template: `
      <gh-tile color="main" (click)="increment()" [disabled]="isDisabled">
        <gh-tile-icon></gh-tile-icon>
        <gh-tile-title>L-W8-64-APMDay3</gh-tile-title>
        <gh-tile-subtitle>Linux (x84, 64-bit)</gh-tile-subtitle>
        Network traffic
      </gh-tile>
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
