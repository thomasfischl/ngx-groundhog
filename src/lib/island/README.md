# Island

`<gh-island>` is a visual container for wrapping a wide variety of contents.
In addition to the custom content, the island can also hold some special sections:
- `<gh-island-title>` - The title of this island, needs to be defined to show the island's header
- `<gh-island-subtitle`> - Right below the title, a subtitle can be placed.
- `<gh-island-icon>` - An icon in the top left corner of the island. Use `<gh-icon>` for it.
- `<gh-island-action>` - Your place to add action buttons. Will be displayed in the top right corner. Use the buttons `secondary` variant.

**Example:**
```html
<gh-island>
  <gh-island-icon><gh-icon svgIcon="agent"></gh-icon></gh-island-icon>
  <gh-island-title>Top 3 JavaScript errors</gh-island-title>
  <gh-island-subtitle>Some subtitle</gh-island-subtitle>
  <gh-island-actions><button gh-button variant="secondary">Some Action</button></gh-island-actions>
  The island is not an interactive element, therefore, there are no hover, active and disabled island.
</gh-island>
```

## Accessibility
Islands can be used in a wide variety of scenarios and can contain many different types of content.
Due to this dynamic nature, the appropriate accessibility treatment depends on how `<gh-island>` is used.

There are several ARIA roles that communicate that a portion of the UI represents some semantically meaningful whole.
Depending on what the content of the island means to your application, role="group", role="region", or a landmark role should typically be applied.

A role is not necessary when the card is used as a purely decorative container that does not convey a meaningful grouping of related content for a single subject.
In these cases, the content of the card should follow standard practices for document content.
