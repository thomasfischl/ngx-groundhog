# Icon

`<gh-icon>` provides an easy way to use SVG (not font or bitmap) icons in your app. It does so by directly inlining the SVG content into the page as a child of the component. (Rather than using a tag or a div background image).
This makes it easier to apply CSS styles to SVG icons.

**Example**
```html
<gh-icon svgIcon="agent"></gh-icon> <!-- Icon named 'agent' in the default namespace -->
<gh-icon svgIcon="core:ai"></gh-icon> <!-- Icon named 'ai' in the 'core' namespace -->
```

## Registering icons

`GhtIconRegistry` is an injectable service that allows you to associate icon names with SVG URLs. You can do so by calling the `addSvgIcon` or `addSvgIconInNamespace` methods.
After registering an icon, it can be displayed by setting the `svgIcon` input.
For an icon in the default namespace, use the name directly. For a non-default namespace, use the format `[namespace]:[name]`.

In order to prevent XSS vulnerabilities, any SVG URLs passed to the `GhIconRegistry' must be marked as trusted resource URLs by using Angular's `DomSanitizer` service.

Also note that all SVG icons are fetched via `XmlHttpRequest`, and due to the same-origin policy, their URLs must be on the same domain as the containing page, or their servers must be configured to allow cross-domain access.

```ts
@Component({selector: 'icon-demo'})
export class IconDemo {
  constructor(iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
      // Registering an icon named 'agend' in the default namespace
      .addSvgIcon('agent',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/agent.svg'))

      // Registering an icon named 'ai' in the 'core namespace
      .addSvgIconInNamespace('core', 'ai',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/ai.svg'));
  }
}
```

## Accessibility

Similar to an `<img>` element, an icon alone does not convey any useful information for a screen-reader user.
The user of `<gh-icon>` must provide additional information on to how the icon is used.
Based on this, `gh-icon` is marked as `aria-hidden="true"` by default, but this can be overriden by adding `aria-hidden="false"` to the element.
