import {inject, async, fakeAsync, tick, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {GhIconModule} from './icon-module';
import {GhIconRegistry} from './icon-registry';

export const FAKE_SVGS = {
  cola: '<svg><path id="cola" name="cola"></path></svg>',
  pepsi: '<svg><path id="pepsi" name="pepsi"></path></svg>',
};

/** Returns the CSS classes assigned to an element as a sorted array. */
function sortedClassNames(element: Element): string[] {
  return element.className.split(' ').sort();
}

/** Verifies that an element contains a single `<svg>` child element, and returns that child. */
function verifyAndGetSingleSvgChild(element: SVGElement): SVGElement {
  expect(element.id).toBeFalsy();
  expect(element.childNodes.length).toBe(1);
  const svgChild = element.childNodes[0] as SVGElement;
  expect(svgChild.tagName.toLowerCase()).toBe('svg');
  return svgChild;
}

/**
 * Verifies that an element contains a single `<path>` child element whose "id" attribute has
 * the specified value.
 */
function verifyPathChildElement(element: Element, attributeValue: string): void {
  expect(element.childNodes.length).toBe(1);
  const pathElement = element.childNodes[0] as SVGPathElement;
  expect(pathElement.tagName.toLowerCase()).toBe('path');
  // The testing data SVGs have the name attribute set for verification.
  expect(pathElement.getAttribute('name')).toBe(attributeValue);
}

describe('GhIcon', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, GhIconModule],
      declarations: [
        IconWithSize,
        IconFromSvgName,
        IconWithAriaHiddenFalse,
        IconWithBindingAndNgIf
      ]
    });

    TestBed.compileComponents();
  }));

  let iconRegistry: GhIconRegistry;
  let http: HttpTestingController;
  let sanitizer: DomSanitizer;

  beforeEach(inject([GhIconRegistry, HttpTestingController, DomSanitizer],
    (registry: GhIconRegistry, h: HttpTestingController, ds: DomSanitizer) => {
      iconRegistry = registry;
      http = h;
      sanitizer = ds;
    }));

  it('should apply class for default size', () => {
    const fixture = TestBed.createComponent(IconWithSize);
    const testComponent = fixture.componentInstance;
    const ghIconElement = fixture.debugElement.nativeElement.querySelector('gh-icon');
    testComponent.iconName = 'home';
    fixture.detectChanges();
    expect(sortedClassNames(ghIconElement)).toEqual(['gh-icon', 'gh-icon-medium']);
  });

  it('should apply class based on size attribute', () => {
    const fixture = TestBed.createComponent(IconWithSize);
    const testComponent = fixture.componentInstance;
    const ghIconElement = fixture.debugElement.nativeElement.querySelector('gh-icon');
    testComponent.iconName = 'home';
    testComponent.iconSize = 'big';
    fixture.detectChanges();
    expect(sortedClassNames(ghIconElement)).toEqual(['gh-icon', 'gh-icon-big']);
    testComponent.iconSize = 'small';
    fixture.detectChanges();
    expect(sortedClassNames(ghIconElement)).toEqual(['gh-icon', 'gh-icon-small']);
  });

  it('should throw if a wrong size has been provided', () => {
    const fixture = TestBed.createComponent(IconWithSize);
    const testComponent = fixture.componentInstance;
    const ghIconElement = fixture.debugElement.nativeElement.querySelector('gh-icon');
    testComponent.iconName = 'home';
    testComponent.iconSize = 'superduperbig'; // <- wrong size
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should mark gh-icon as aria-hidden by default', () => {
    const fixture = TestBed.createComponent(IconWithSize);
    const iconElement = fixture.debugElement.nativeElement.querySelector('gh-icon');
    expect(iconElement.getAttribute('aria-hidden'))
      .toBe('true', 'Expected the gh-icon element has aria-hidden="true" by default');
  });

  it('should not override a user-provided aria-hidden attribute', () => {
    const fixture = TestBed.createComponent(IconWithAriaHiddenFalse);
    const iconElement = fixture.debugElement.nativeElement.querySelector('gh-icon');
    expect(iconElement.getAttribute('aria-hidden'))
      .toBe('false', 'Expected the gh-icon element has the user-provided aria-hidden value');
  });

  describe('Icons from URLs', () => {
    it('should register icon URLs by name', fakeAsync(() => {
      iconRegistry.addSvgIcon('notpepsi', trust('cola.svg'));
      iconRegistry.addSvgIcon('notcola', trust('pepsi.svg'));

      const fixture = TestBed.createComponent(IconFromSvgName);
      const testComponent = fixture.componentInstance;
      const iconElement = fixture.debugElement.nativeElement.querySelector('gh-icon');
      let svgElement: SVGElement;

      testComponent.iconName = 'notcola';
      fixture.detectChanges();
      http.expectOne('pepsi.svg').flush(FAKE_SVGS.pepsi);
      svgElement = verifyAndGetSingleSvgChild(iconElement);
      verifyPathChildElement(svgElement, 'pepsi');

      // Change the icon, and the SVG element should be replaced.
      testComponent.iconName = 'notpepsi';
      fixture.detectChanges();
      http.expectOne('cola.svg').flush(FAKE_SVGS.cola);
      svgElement = verifyAndGetSingleSvgChild(iconElement);
      verifyPathChildElement(svgElement, 'cola');

      // Using an icon from a previously loaded URL should not cause another HTTP request.
      testComponent.iconName = 'notcola';
      fixture.detectChanges();
      http.expectNone('pepsi.svg');
      svgElement = verifyAndGetSingleSvgChild(iconElement);
      verifyPathChildElement(svgElement, 'pepsi');

      // Assert that a registered icon can be looked-up by url.
      iconRegistry.getSvgIconFromUrl(trust('cola.svg')).subscribe(element => {
        verifyPathChildElement(element, 'cola');
      });

      tick();
    }));

    it('should throw an error when using an untrusted icon url', () => {
      iconRegistry.addSvgIcon('notcola', 'pepsi.svg');
      expect(() => {
        let fixture = TestBed.createComponent(IconFromSvgName);
        fixture.componentInstance.iconName = 'notcola';
        fixture.detectChanges();
      }).toThrowError(/unsafe value used in a resource URL context/);
    });

    // This is actuallay an issue that was reported to material some time ago
    // but we should also make sure to not run into the same problem
    // https://github.com/angular/material2/issues/6093
    it('should not throw when toggling an icon that has a binding in IE11', () => {
      iconRegistry.addSvgIcon('notpepsi', trust('cola.svg'));
      const fixture = TestBed.createComponent(IconWithBindingAndNgIf);
      fixture.detectChanges();
      http.expectOne('cola.svg').flush(FAKE_SVGS.cola);
      expect(() => {
        fixture.componentInstance.showIcon = false;
        fixture.detectChanges();

        fixture.componentInstance.showIcon = true;
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  /** Marks an svg icon url as explicitly trusted. */
  function trust(iconUrl: string): SafeResourceUrl {
    return sanitizer.bypassSecurityTrustResourceUrl(iconUrl);
  }
});

@Component({template: `<gh-icon [size]="iconSize">{{iconName}}</gh-icon>`})
class IconWithSize {
  iconName = '';
  iconSize;
}

@Component({template: `<gh-icon [svgIcon]="iconName"></gh-icon>`})
class IconFromSvgName {
  iconName: string | undefined = '';
}

@Component({template: '<gh-icon aria-hidden="false"></gh-icon>'})
class IconWithAriaHiddenFalse { }

@Component({template: `<gh-icon [svgIcon]="iconName" *ngIf="showIcon">{{iconName}}</gh-icon>`})
class IconWithBindingAndNgIf {
  iconName = 'notpepsi';
  showIcon = true;
}
