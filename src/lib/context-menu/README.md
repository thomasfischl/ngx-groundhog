# Context Menu

The Angular Groundhog Context Menu creates a menu thats hidden inside an overlay. It is possible to disable the entire context menu or the items within. Each item within is rendered as a `<button gh-button color="secondary">`.

**Example**
```html
<gh-ca-menu>
  <gh-ca-menu-item>Edit</gh-ca-menu-item>
  <gh-ca-menu-item>Approve</gh-ca-menu-item>
  <gh-ca-menu-item>Delete</gh-ca-menu-item>
</gh-ca-menu>
```

There are currently two selectors for the menu and two for the items:

## Selectors

### Context Menu

```html
<gh-ca-menu> <!--shorthand-->
<gh-context-menu>
```

### Context Menu Item

```html
<gh-ca-menu-item> <!--shorthand-->
<gh-context-menu-item>
```

## Events


