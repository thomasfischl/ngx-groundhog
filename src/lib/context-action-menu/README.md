# Context Action Menu

The Angular Groundhog Context Action Menu creates a menu thats hidden inside an overlay. It is possible to disable the entire context action menu or the items within. Each item within is rendered as a `<button gh-button color="secondary">`.

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

### Context Action Menu

```html
<gh-ca-menu> <!--shorthand-->
<gh-context-action-menu>
```

### Context Action Menu Item

```html
<gh-ca-menu-item> <!--shorthand-->
<gh-context-action-menu-item>
```

## Events


