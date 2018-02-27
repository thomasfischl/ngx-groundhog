import { Component } from '@angular/core';
import { GhThemingModule } from './index';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('GhTHeme', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GhThemingModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  it('should apply the gh-theme class', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();

    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme')).toBeTruthy();
  });

  it('should apply the corrent class if a name is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-turquoise')).toBeTruthy();

    testComponent.theme = 'royalblue:light';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-royalblue')).toBeTruthy();

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-turquoise')).toBeTruthy();

    testComponent.theme = ':dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-turquoise')).toBeFalsy();
  });

  it('should apply the corrent class if a variant is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-light')).toBeFalsy();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-dark')).toBeFalsy();

    testComponent.theme = 'turquoise:light';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-light')).toBeTruthy();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-dark')).toBeFalsy();

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-light')).toBeFalsy();
    expect(sectionDebugElement.nativeElement.classList.contains('gh-theme-dark')).toBeTruthy();
  });
});

@Component({
  selector: 'test-app',
  template: `<section [ghTheme]="theme"></section>`
})
class TestApp {
  theme = 'turquoise';
}
