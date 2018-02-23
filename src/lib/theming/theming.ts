import { Directive, Input, ElementRef } from '@angular/core';

const THEME_VALIDATION_RX = /([a-zA-Z-]+)(?::(light|dark))?/;
const THEME_VARIANTS = ['light', 'dark'];
const DEFAULT_VARIANT = 'light';

export type GhThemeVariant = 'light' | 'dark';

export function getGhThemeNotValidError(name: string): Error {
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

  /**
   * Theme name and optional the variant.
   * Can be:
   * - royalblue
   * - royalblue:light
   * - royalblue:dark
   */
  @Input()
  set ghTheme(value: string) {
    const result = value.match(THEME_VALIDATION_RX);
    if (result === null) {
      throw getGhThemeNotValidError(value);
    }
    const className = this._genClassName();
    const [, name, variant] = result;
    this._name = name;
    this._variant =
      (variant && THEME_VARIANTS[variant] !== -1 ? variant : DEFAULT_VARIANT) as GhThemeVariant;
    this._replaceCssClass(this._genClassName(), className);
  }

  /** Name of the specified theme (royalblue, ...) */
  get name(): string | null { return this._name; }

  /** Whether the theme is the light or dark variant */
  get variant(): GhThemeVariant { return this._variant; }

  private _name: string | null = null;
  private _variant: GhThemeVariant = 'light';

  constructor(private _elementRef: ElementRef) { }

  /** Generates the theme class name for the currently defined name and variant */
  private _genClassName(): string | undefined {
    const name = this._name || ``;
    const variant = this._variant ? `-${this._variant}` : '';
    return name ? `gh-theme-${name}${variant}` : undefined;
  }

  /** Replaces classes on the host element */
  private _replaceCssClass(newClass?: string, oldClass?: string) {
    if (oldClass) {
      this._elementRef.nativeElement.classList.remove(oldClass);
    }
    if (newClass) {
      this._elementRef.nativeElement.classList.add(newClass);
    }
  }
}
