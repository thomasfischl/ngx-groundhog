# Context Menu

The Angular Groundhog Context Menu creates a menu thats hidden inside an overlay. It is possible to disable the entire context menu or the items within. Each item within is rendered as a `gh-button`. The context menu traps the focus inside the overlay until it is closed again. It sets the focus to the previously focused element when closed.

**Example**
```html
<gh-context-menu>
  <gh-context-menu-item>Edit</gh-context-menu-item>
  <gh-context-menu-item>Approve</gh-context-menu-item>
  <gh-context-menu-item (onClick)="delete()">Delete</gh-context-menu-item>
</gh-context-menu>
```

## Components

### Context Menu

```html
<gh-context-menu>
```

#### Properties

Inherited by mixinTabIndex
```typescript
@Input('tabIndex')
tabIndex: number
```
Gets and sets the tabIndex on the context menu, defaults to 0

Inherited by mixinDisabled
```typescript
@Input('disabled')
disabled: boolean
```
Gets and sets the disabled property on the context menu.

Inherited by mixinColor
```typescript
@Input('color')
color: ThemePalette
```
Gets and sets the ThemePaletter for the context menu

```typescript
@Input('aria-label')
ariaLabel: string
```
Aria label of the context menu trigger button. If no label is specified `Context menu` will be used as a fallback.

```typescript
@Output()
openedChanged: EventEmitter<boolean>
```
Event emitted when the contextmenu opens or closes.

```typescript
panelOpen: boolean
```
Returns wether or not the panel is open

#### Methods

```typescript
open
```
Opens the context menu

```typescript
close
```
Closes the context menu

```typescript
focus
```
Focuses the context menu

### Context menu item

```html
<gh-context-menu-item>
```

#### Properties

Inherited by mixinTabIndex
```typescript
@Input('tabIndex')
tabIndex: number
```
Gets and sets the tabIndex on the context menu item, defaults to 0

Inherited by mixinDisabled
```typescript
@Input('disabled')
disabled: boolean
```
Gets and sets the disabled property on the context menu item

Inherited by mixinColor
```typescript
@Input('color')
color: ThemePalette
```
Gets and sets the ThemePaletter for the context menu item

```typescript
@Output()
onClick: EventEmitter<Event>
```
Event emitted when the context menu item is clicked

