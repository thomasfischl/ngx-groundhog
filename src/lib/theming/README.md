# Theming

Including a theme is required to apply all of the core and theme styles to your application. Every theme includes a `light` and a `dark` variant.
Include a theme globally in your application. If you're using the Angular CLI, you can add this to your styles.css:

```css
@import "~@dynatrace/ngx-groundhog/themes/turquoise.css";
```

## Changing Themes
If you want to change the theme or set a different theme or variant to a specific region in your app, use the `ghTheme` directive to do so:

```html
<section ghTheme="royalblue:dark">This is now a royal blue dark</section>
<!-- this is also possible -->
<section ghTheme="royalblue">This is now a royal blue</section>
<!-- or this -->
<section ghTheme=":dark">This is now dark</section>
```

When no variant (`light` or `dark`) or name is provided, the parent variant/name will be used.
If you want to use multiple themes in you app a `@dynatrace/ngx-groundhob/themes/all.css` is also available.


| Name         | File            | Usage                                                           |
|--------------|-----------------|-----------------------------------------------------------------|
| `turquoise`  | `turquoise.css` | Default theme.                                                  |
| `purple`     | `purple.css`    | Theme for all views on application level.                       |
| `royalblue`  | `royalblue.css` | Theme for all views on service, transaction and database level. |
| `blue`       | `blue.css`      | Theme for all views on infrastructure level.                    |
