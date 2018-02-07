import {mixinColor} from './color';
import {ElementRef} from '@angular/core';

describe('MixinColor', () => {

  it('should augment an existing class with a color property', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.color)
        .toBeFalsy('Expected the mixed-into class to have a color property');

    instance.color = 'secondary';

    expect(instance.color)
        .toBe('secondary', 'Expected the mixed-into class to have an updated color property');
  });

  it('should remove old color classes if new color is set', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.testElement.classList.length)
      .toBe(0, 'Expected the element to not have any classes at initialization');

    instance.color = 'primary';

    expect(instance.testElement.classList)
      .toContain('gh-primary', 'Expected the element to have the "gh-primary" class set');

    instance.color = 'secondary';

    expect(instance.testElement.classList)
      .not.toContain('gh-primary', 'Expected the element to no longer have "gh-primary" set.');
    expect(instance.testElement.classList)
      .toContain('gh-secondary', 'Expected the element to have the "gh-secondary" class set');
  });

  it('should allow having no color set', () => {
    const classWithColor = mixinColor(TestClass);
    const instance = new classWithColor();

    expect(instance.testElement.classList.length)
      .toBe(0, 'Expected the element to not have any classes at initialization');

    instance.color = 'primary';

    expect(instance.testElement.classList)
      .toContain('gh-primary', 'Expected the element to have the "gh-primary" class set');

    instance.color = undefined;

    expect(instance.testElement.classList.length)
      .toBe(0, 'Expected the element to have no color class set.');
  });

  it('should allow having a default color if specified', () => {
    const classWithColor = mixinColor(TestClass, 'secondary');
    const instance = new classWithColor();

    expect(instance.testElement.classList)
      .toContain('gh-secondary', 'Expected the element to have the "gh-secondary" class by default.');

    instance.color = undefined;

    expect(instance.testElement.classList)
      .toContain('gh-secondary', 'Expected the default color "gh-secondary" to be set.');
  });

});

class TestClass {
  testElement: HTMLElement = document.createElement('div');

  /** Fake instance of an ElementRef. */
  _elementRef = new ElementRef(this.testElement);
}