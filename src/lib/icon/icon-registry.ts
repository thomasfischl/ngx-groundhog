import {
  Injectable,
  SecurityContext,
  Optional,
  SkipSelf,
  Inject,
  InjectionToken
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {of as observableOf} from 'rxjs/observable/of';
import {finalize} from 'rxjs/operators/finalize';
import {share} from 'rxjs/operators/share';
import {map} from 'rxjs/operators/map';
import {tap} from 'rxjs/operators/tap';
import {_throw as observableThrow} from 'rxjs/observable/throw';

/** Returns an exception to be thrown when a URL couldn't be sanitized. */
function getIconFailedToSanitizeError(url: SafeResourceUrl): Error {
  return Error(`The URL "${url}" provided to GhIconRegistry was not trusted as a resource URL ` +
    `via Angular's DomSanitizer.`);
}

/**
 * Returns an exception to be thrown in the case when attempting to
 * load an icon with a name that cannot be found.
 */
function getIconNameNotFoundError(iconName: string): Error {
  return Error(`Unable to find icon with the name "${iconName}"`);
}

/** Configuration for an icon, including the URL and possibly the cached SVG element. */
interface SvgIconConfig {
  svgElement: SVGElement | null;
  url: SafeResourceUrl;
}
/**
 * Creates a new config object without setting svgElement
 * We use a function for creating a config object instead of a class to
 * reduce the footprint a class has (interface get removed on compile time)
 * @param url from which to fetch the SVG icon.
 */
function createSvgIconConfig(url: SafeResourceUrl): SvgIconConfig {
  return {url, svgElement: null};
}

@Injectable()
export class GhIconRegistry {

  /**
   * URLs and cached SVG elements for individual icons.
   * Keys are of the format "[namespace]:[icon]".
   */
  private _svgIconConfigs = new Map<string, SvgIconConfig>();

  /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
  private _inProgressUrlFetches = new Map<string, Observable<string>>();

  /** Cache for icons loaded by direct URLs. */
  private _cachedIconsByUrl = new Map<string, SVGElement>();

  constructor(
    @Optional() private _httpClient: HttpClient,
    private _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private _document?: any) {
  }

  /**
   * Registers an icon by URL in the default namespace.
   * @param iconName Name under which the icon should be registered.
   * @param url
   */
  addSvgIcon(iconName: string, url: SafeResourceUrl): this {
    return this.addSvgIconInNamespace('', iconName, url);
  }

  /**
   * Registers an icon by URL in the specified namespace.
   * @param namespace Namespace in which the icon should be registered.
   * @param iconName Name under which the icon should be registered.
   * @param url
   */
  addSvgIconInNamespace(namespace: string, iconName: string, url: SafeResourceUrl): this {
    const key = iconKey(namespace, iconName);
    this._svgIconConfigs.set(key, createSvgIconConfig(url));
    return this;
  }

  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
   * and namespace. The icon must have been previously registered with addIcon or addIconSet;
   * if not, the Observable will throw an error.
   * @param name Name of the icon to be retrieved.
   * @param namespace Namespace in which to look for the icon.
   */
  getNamedSvgIcon(name: string, namespace: string = ''): Observable<SVGElement> {
    // Return (copy of) cached icon if possible.
    const key = iconKey(namespace, name);
    const config = this._svgIconConfigs.get(key);

    if (config) {
      return this._getSvgIconFromConfig(config);
    }

    return observableThrow(getIconNameNotFoundError(key));
  }

  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) from the given URL.
   * The response from the URL may be cached so this will not always cause an HTTP request, but
   * the produced element will always be a new copy of the originally fetched icon. (That is,
   * it will not contain any modifications made to elements previously returned).
   * @param safeUrl URL from which to fetch the SVG icon.
   */
  getSvgIconFromUrl(safeUrl: SafeResourceUrl): Observable<SVGElement> {
    let url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);

    if (!url) {
      throw getIconFailedToSanitizeError(safeUrl);
    }

    let cachedIcon = this._cachedIconsByUrl.get(url);

    if (cachedIcon) {
      return observableOf(cloneSvg(cachedIcon));
    }

    return this._loadSvgIconFromConfig(createSvgIconConfig(safeUrl)).pipe(
      tap(svg => this._cachedIconsByUrl.set(url!, svg)),
      map(svg => cloneSvg(svg)),
    );
  }

  /**
   * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
   * from it.
   */
  private _loadSvgIconFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    return this._fetchUrl(config.url)
        .pipe(map(svgText => this._createSvgElementForSingleIcon(svgText)));
  }

  /**
   * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
   */
  private _getSvgIconFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    if (config.svgElement) {
      return observableOf(cloneSvg(config.svgElement));
    }
    return this._loadSvgIconFromConfig(config).pipe(
      tap(svg => config.svgElement = svg),
      map(svg => cloneSvg(svg)),
    );
  }

  /** Creates a DOM element from the given SVG string, and adds default attributes. */
  private _createSvgElementForSingleIcon(responseText: string): SVGElement {
    const svg = this._svgElementFromString(responseText);
    this._setSvgAttributes(svg);
    return svg;
  }

  /** Sets the default attributes for an SVG element to be used as an icon. */
  private _setSvgAttributes(svg: SVGElement): SVGElement {
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    svg.setAttribute('fit', '');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
    return svg;
  }

  /** Creates a DOM element from the given SVG string. */
  private _svgElementFromString(str: string): SVGElement {
    if (this._document || typeof document !== 'undefined') {
      const div = (this._document || document).createElement('DIV');
      div.innerHTML = str;
      const svg = div.querySelector('svg') as SVGElement;
      if (!svg) {
        throw Error('<svg> tag not found');
      }
      return svg;
    }

    throw new Error('GhIconRegistry could not resolve document.');
  }

  /**
   * Returns an Observable which produces the string contents of the given URL. Results may be
   * cached, so future calls with the same URL may not cause another HTTP request.
   */
  private _fetchUrl(safeUrl: SafeResourceUrl): Observable<string> {
    if (!this._httpClient) {
      throw Error('Could not find HttpClient provider for use with ngx-groundhog icons. ' +
        'Please include the HttpClientModule from @angular/common/http in your ' +
        'app imports.');
    }

    const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);

    if (!url) {
      throw getIconFailedToSanitizeError(safeUrl);
    }

    // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
    // already a request in progress for that URL. It's necessary to call share() on the
    // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
    const inProgressFetch = this._inProgressUrlFetches.get(url);

    if (inProgressFetch) {
      return inProgressFetch;
    }

    const req = this._httpClient.get(url, {responseType: 'text'}).pipe(
      finalize(() => this._inProgressUrlFetches.delete(url)),
      share(),
    );

    this._inProgressUrlFetches.set(url, req);
    return req;
  }
}

/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg: SVGElement): SVGElement {
  return svg.cloneNode(true) as SVGElement;
}

/** Returns the cache key to use for an icon namespace and name. */
function iconKey(namespace: string, name: string) {
  return namespace + ':' + name;
}

export function ICON_REGISTRY_PROVIDER_FACTORY(
  parent: GhIconRegistry,
  httpClient: HttpClient,
  sanitizer: DomSanitizer,
  document?: any
) {
  return parent || new GhIconRegistry(httpClient, sanitizer, document);
}

export const ICON_REGISTRY_PROVIDER = {
  provide: GhIconRegistry,
  deps: [
    [new Optional(), new SkipSelf(), GhIconRegistry],
    [new Optional(), HttpClient],
    DomSanitizer,
    [new Optional(), DOCUMENT as InjectionToken<any>],
  ],
  useFactory: ICON_REGISTRY_PROVIDER_FACTORY,
};
