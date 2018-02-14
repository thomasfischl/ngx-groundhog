# Progress circle

`<gh-progress-circle>` is a circular indicators of progress and activity.

##  Usage
The `<gh-progress-circle>` takes the following values:

| Name     | Defaut value | Description                                           |
|----------|--------------|-------------------------------------------------------|
| `value`  | 0            | The value of the progress circle                      |
| `max`    | 100          | The maximum value that the progress circle can have.  |
| `min`    | 0            | The minimum value that the progress circle can have.  |

**Example:**
```html
<gh-progress-circle [value]="myProgress" [max]="myMax" [min]="myMin"></gh-progress-circle>
```
```ts
@Component({
  selector: 'progress-circle-demo',
  templateUrl: 'progress-circle-demo.html',
})
export class ProgressCircleDemo {
  myProgress = 150;
  myMax = 200;
  myMin = 100;
}
```

## Accessibility
Each progress circle should be given a meaningful label via `aria-label` or `aria-labelledby`.
