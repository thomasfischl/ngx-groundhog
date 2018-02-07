# Select

`<gh-select>` is like the native `<select>` a form control for selecting a value from a list of options. It is also designed to work with Angular Forms.
By using the `<gh-option>` element, which is also provided in the select module, you can add values to the select.
The API of the `<gh-select>` is very similar to the native `<select>` element, but has some additional useful functions, like a `placeholder` property.
It is possible to disable the entire select or individual options in the select by using the disabled property on the `<gh-select>` or `<gh-option>`

**Example**
```html
<gh-select placeholder="Please select a fruit">
  <gh-option value="ananas">Ananas</gh-option>
  <gh-option value="blueberry">Blueberry</gh-option>
  <gh-option value="apple">Apple</gh-option>
</gh-select>
```

## Getting and setting the value
If you don't use Angular forms the `<gh-select>` component support 2-way binding to the value property.

**Example**
```html
<gh-select placeholder="Please select a fruit" [value]="currentFruit">
  <gh-option value="ananas">Ananas</gh-option>
  <gh-option value="blueberry">Blueberry</gh-option>
  <gh-option value="apple">Apple</gh-option>
</gh-select>
```

```ts
@Component({selector: 'my-comp'})
class MyComp {
  currentFruit = 'ananas';
}
```

The `<gh-select>` also supports all of the form directives from the core FormsModule (NgModel) and ReactiveFormsModule (FormControl, FormGroup, etc.).
As with native `<select>`, `<gh-select>` also supports a `compareWith` function. 
(Additional information about using a custom `compareWith` function can be found in the [Angular forms documentation](https://angular.io/api/forms/SelectControlValueAccessor#caveat-option-selection)).

**Example**
```html
<gh-select placeholder="Please select a fruit" [(ngModel)]="currentDrink">
  <gh-option value="ananas">Ananas</gh-option>
  <gh-option value="blueberry">Blueberry</gh-option>
  <gh-option value="apple">Apple</gh-option>
</gh-select>
```
