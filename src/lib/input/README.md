# Input

`ghInput` is a directive that allows native `<input>` and `<textarea>` elements to work with `<gh-form-field>`.

```html
<input type="text" ghInput>
<textarea ghInput></textarea>
```

## Attributes

All valid `<input>` and `<textarea>` attributes can be used on `ghInput` including `ngModel` and `formControl`. The only exception ist `type` where not all values are possible.

**Supported `type` values:**
- date
- datetime-local
- email
- month
- number
- password
- search
- tel
- text
- time
- url
- week

## Form field

`ghInput` works best with `<gh-form-field>`. The form field component wraps the input and provides additional features like Labels (`<gh-label>`), Errors (`<gh-error>`) and Hints (`<gh-hint>`).

```html
<gh-form-field>
  <gh-label>E-Mail:</gh-label>
  <input ghInput
    required
    type="email"
    placeholder="Enter your email address"
    [(ngModel)]="emailValue">
  <gh-hint>Awesome hint appears</gh-hint>
  <gh-error>Enter a valid email address</gh-error>
</gh-form-field>
```

## Accessibility

The ghInput directive works with native `<input>` and `<textarea>` to provide an accessible experience.

If there's no `<gh-form-field>` used or it does not contain a `<gh-label>`, aria-label, aria-labelledby or <label for=...> should be added.

Any gh-error and gh-hint are automatically added to the input's aria-describedby list, and aria-invalid is automatically updated based on the input's validity state.
