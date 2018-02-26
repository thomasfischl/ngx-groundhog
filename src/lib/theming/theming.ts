import {
  Directive,
  Input,
  ElementRef,
  Optional,
  SkipSelf,
  OnDestroy,
  isDevMode
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

const MAX_DEPTH = 1;
const THEME_VALIDATION_RX = /((?:[a-zA-Z-]+)?)(?::(light|dark))?/;
const THEME_VARIANTS = ['light', 'dark'];
export type GhThemeVariant = 'light' | 'dark' | null;

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
export class GhTheme implements OnDestroy {

  /**
   * Theme name and the variant.
   * could be:
   * - royalblue
   * - royalblue:light
   * - royalblue:dark
   * - :light
   * - :dark
   */
  @Input()
  set ghTheme(value: string) {
    const result = value.match(THEME_VALIDATION_RX);
    if (result === null) {
      throw getGhThemeNotValidError(value);
    }
    const classNames = this._genClassNames();
    const currentName = this.name;
    const currentVariant = this.variant;
    const [, name, variant] = result;

    this._name = name || (this._parentTheme && this._parentTheme.name) || null;
    this._variant =
      variant && THEME_VARIANTS[variant] !== -1 ? variant as GhThemeVariant :
        (this._parentTheme && this._parentTheme.variant) || null;

    // Only replace css classes if name or variant have actually changed
    if (name !== currentName || variant !== currentVariant) {
      this._replaceHostClasses(this._genClassNames(), classNames);
      this._stateChanges.next();
    }
  }

  /** Name of the specified theme (royalblue, ...) */
  get name(): string | null { return this._name; }

  /** Whether the theme is the light or dark variant */
  get variant(): GhThemeVariant { return this._variant; }

  /** @internal The level of depth */
  get _depthLevel(): number {
    return this._parentTheme ? this._parentTheme._depthLevel + 1 : 1;
  }

  /** @internal Emits on state change */
  readonly _stateChanges: Subject<void> = new Subject<void>();

  private _name: string | null = null;
  private _variant: GhThemeVariant = null;
  private _parentSub: Subscription;

  constructor(
    private _elementRef: ElementRef,
    @Optional() @SkipSelf() private _parentTheme: GhTheme
  ) {
    if (this._parentTheme) {
      this._parentSub = this._parentTheme._stateChanges
        .subscribe(() => this.ghTheme = this.ghTheme);
    }
    this._warnIfDepthExceeded();
  }

  ngOnDestroy() {
    this._stateChanges.next();
    this._stateChanges.complete();
  }

  /** Generates the theme class names for the currently defined name and variant */
  private _genClassNames(): [string | null, string | null] {
    return [
      this.name ? `gh-theme-${this.name}` : null,
      this.variant ? `gh-theme-${this.variant}` : null,
    ];
  }

  /** Replaces classes on the host element */
  private _replaceHostClasses(
    newClasses?: [string | null, string | null],
    oldClasses?: [string | null, string | null]
  ) {
    if (oldClasses) {
      this._elementRef.nativeElement.classList.remove(...oldClasses.filter(c => !!c));
    }
    if (newClasses) {
      this._elementRef.nativeElement.classList.add(...newClasses.filter(c => !!c));
    }
  }

  /** Notify developers if max depth level has been exceeded */
  private _warnIfDepthExceeded() {
    if (isDevMode() && this._depthLevel > MAX_DEPTH) {
      console.warn(`The max supported depth level (${MAX_DEPTH}) of nested themes (ghTheme) ` +
       `has been exceeded. This could result in wrong styling unpredictable styling side effects.`);
    }
  }
}
