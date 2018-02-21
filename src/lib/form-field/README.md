# Form field

`<gh-form-field>` is a component that wraps form input components like `<gh-select>` or `ghInput` and provides functionality for a label (`<gh-label>`), errors (`<gh-error>`) and hints (`<gh-hint>`).

```html
<gh-form-field>
  <input ghInput
    required
    type="email"
    placeholder="Enter your email address"
    [(ngModel)]="emailValue">
</gh-form-field>
```

## Label

A label can be applied by either setting the `hintLabel` attribute/binding or adding a `<gh-label>` element. `<gh-form-field>` takes care of linking the label correctly to the form component by adding `for="input-id"` and the correct aria attributes.

```html
<gh-form-field>
  <gh-label>Email</gh-label>
  <input ghInput
    required
    type="email"
    placeholder="Enter your email address"
    [(ngModel)]="emailValue">
</gh-form-field>
```

## Hint labels

Hint labels are additional descriptive text that appears below the form field. A `<gh-form-field>` can have up to two hint labels: one start-aligned and one end-aligned.

Hint labels are specified in one of two ways: either by using the hintLabel property of `<gh-form-field>`, or by adding a `<gh-hint>` element inside the form field. When adding a hint via the hintLabel property, it will be treated as the start hint. Hints added via the `<gh-hint>` hint element can be added to either side by setting the align property on `<gh-hint>` to either start or end. Attempting to add multiple hints to the same side will raise an error.

`<gh-form-field>` takes care of linking the hints correctly to the form component by adding the correct aria attributes.

```html
<gh-form-field>
  <gh-label>Email</gh-label>
  <input ghInput
    required
    type="email"
    placeholder="Enter your email address"
    [(ngModel)]="emailValue">
  <gh-hint>Left hint</gh-hint>
  <gh-hint align="end">Right hint</gh-hint>
</gh-form-field>
```

## Error messages

Error messages can be shown under the form field by adding `<gh-error>` elements inside the form field. Errors are hidden initially and will be displayed on invalid form fields after the user has interacted with the element or the parent form has been submitted. The errors will appear on top of the hint labels and will overlap them.

If a form field can have more than one error state, it is up to the consumer to toggle which messages should be displayed. This can be done with `ngIf` or `ngSwitch`.

```html
<gh-form-field>
  <gh-label>Email</gh-label>
  <input ghInput
    required
    type="email"
    placeholder="Enter your email address"
    [(ngModel)]="emailValue">
  <gh-hint>Left hint</gh-hint>
  <gh-hint align="end">Right hint</gh-hint>
  <gh-error>Please insert something</gh-error>
</gh-form-field>
```

## Accessibility

If a `<gh-label>` is specified, it will be automatically used as the label for the form field control. If no label is specified, the user should label the form field control themselves using `aria-label`, `aria-labelledby` or `<label for=...>`.

Any errors and hints added to the form field are automatically added to the form field control's `aria-describedby` set.
