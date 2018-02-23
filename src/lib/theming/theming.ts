import { Directive, Input, ElementRef } from '@angular/core';

const THEME_VALIDATION_RX = /(\w+)(?:\:(light|dark))?/g;

export function getThemeNotValidError(name: string): Error {
  return Error(`The provided theme name "${name}" for ghTheme is not a valid theme!`);
}

@Directive({
  selector: '[ghTheme]',
  exportAs: 'ghTheme',
  host: {
    'class': 'gh-theme'
  }
})
export class GhTheme {

  @Input()
  set ghTheme(value: string) {
    const result = value.match(THEME_VALIDATION_RX);
    if (result === null) {
      throw getThemeNotValidError(value);
    }
    const className = this._genClassName();
    const [name, variant] = result;
    this._name = name;
    if (variant) {
      this._variant = variant as 'light' | 'dark';
    }
    this._replaceCssClass(this._genClassName(), className);
  }

  get name(): string | null { return this._name; }
  get variant(): 'light' | 'dark' | null { return this._variant; }

  private _name: string | null = null;
  private _variant: 'light' | 'dark' | null = null;

  constructor(private _elementRef: ElementRef) { }

  private _genClassName(): string | undefined {
    const name = this._name || ``;
    const variant = this._variant ? `-${this._variant}` : '';
    return name ? `gh-theme-${name}${variant}` : undefined;
  }

  private _replaceCssClass(newClass?: string, oldClass?: string) {
    if (oldClass) {
      this._elementRef.nativeElement.classList.remove(`gh-theme-${oldClass}`);
    }
    if (newClass) {
      this._elementRef.nativeElement.classList.add(`gh-theme-${newClass}`);
    }
  }
}
