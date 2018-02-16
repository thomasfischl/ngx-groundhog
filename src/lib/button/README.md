# Button

The Angular Groundhog button enhances native `<button>` and `<a>` elements with Groundhog styling. Make sure to always use `<button>` or `<a>` tags to provide the accessible experience for the user. A `<button>` element should be used whenever some action is performed. An `<a>` element should be used whenever the user will navigate to another view.

There are currently two button variants that can be applied by adding an attribute:

| Attribute        | Description                          |
|------------------|--------------------------------------|
| `gh-button`      | Regular button, with or without icon |
| `gh-icon-button` | Icon only button                     |

## Theming & Coloring
The button component exposes a `color` and a `variant`property.
`color` can be used to set a specific color palette on this button. Possible values are `default`, `accent`, `warning`, `error` or `cta`.
With `variant` you can set the button to be a `primary`(default) or `secondary` button.

## Accessibility
By using native `<button>` or `<a>` elements accessibility is ensured per default. Buttons or links containing only icons (`gh-icon-button`) should be given a meaningful label via `aria-label` or `aria-labelledby`.
