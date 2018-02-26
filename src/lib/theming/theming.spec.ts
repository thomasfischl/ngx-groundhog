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

    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme');
  });

  it('should apply the corrent class if a name is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-turquoise');

    testComponent.theme = 'royalblue:light';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-royalblue');

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-turquoise');

    testComponent.theme = ':dark';
    fixture.detectChanges();
    expect(!(sectionDebugElement.nativeElement.className).toContain('gh-theme-turquoise'));
  });

  it('should apply the corrent class if a variant is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(!(sectionDebugElement.nativeElement.className).toContain('gh-theme-light'));
    expect(!(sectionDebugElement.nativeElement.className).toContain('gh-theme-dark'));

    testComponent.theme = 'turquoise:light';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-light');
    expect(!(sectionDebugElement.nativeElement.className).toContain('gh-theme-dark'));

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(!(sectionDebugElement.nativeElement.className).toContain('gh-theme-light'));
    expect(sectionDebugElement.nativeElement.className).toContain('gh-theme-dark');
  });
});

@Component({
  selector: 'test-app',
  template: `<section [ghTheme]="theme"></section>`
})
class TestApp {
  theme = 'turquoise';
}
