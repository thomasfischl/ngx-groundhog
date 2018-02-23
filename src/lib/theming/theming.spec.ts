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

  it('should apply the g-theme class', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();

    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme');
  });

  it('should apply the light class if no variant is provided', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();

    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-turquoise-light');
  });

  it('should apply the corrent class if a variant is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));

    testComponent.theme = 'turquoise:light';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-turquoise-light');

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-turquoise-dark');
  });
});

@Component({
  selector: 'test-app',
  template: `<section [ghTheme]="theme"></section>`
})
class TestApp {
  theme = 'turquoise';
}
