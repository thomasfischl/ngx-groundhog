# Tile

`<gh-tile>` is a clickable container for different types of content. A tile consists of various sub elements beside the content itself.
- `<gh-tile-title>`: The tiles title
- `<gh-tile-subtitle>`: (Optional) A tile can also contain an optional subtitle
- `<gh-tile-icon>`: (Optional) An optional icon as a visual key element.

```html
<gh-tile color="main" (click)="handleClick()" [disabled]="isDisabled">
  <gh-tile-icon><gh-icon svgName="linux"></gh-icon></gh-tile-icon>
  <gh-tile-title>L-W8-64-APMDay3</gh-tile-title>
  <gh-tile-subtitle>Linux (x84, 64-bit)</gh-tile-subtitle>
  Network traffic
</gh-tile>
```

## Small version
If no `<gh-tile-subtitle>`, the tile will be rendered as a smaller variant.

## Icon alignment
Per default the `<gh-tile-icon>` will be aligned to the start (left).
If you want to align it to the end (right), add `align="end"` as an argument: `<gh-tile-icon align="end">`.

## Disable
Like every interactive element, the tile also provides a way to disable it by setting the `[disabled]` attribute/binding.

## Usage
Note: A tile is a clickable element (very similar to a button), so a tile should never come without a click handler!

## Accessibility
Basic accessibility is ensured per default. If the tile only contains icons/images/graphs/... or other non descriptive elements a meaningful label via `aria-label` or `aria-labelledby` should be given.
