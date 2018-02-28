# Angular Groundhog

## Available features & Status

| Feature          | Status      | Version        | Docs        | Issue/PR    |
|------------------|-------------|-------------|-------------|-------------|
| Button           | Finished    | >= 0.1.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/button/README.md)            | - |
| Form field       | Finished    | >= 0.1.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/form-field/README.md)        | - |
| Icon             | Finished    | >= 0.1.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/icon/README.md)              | - |
| Input            | Finished    | >= 0.1.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/input/README.md)             | - |
| Island           | Finished    | >= 0.2.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/island/README.md)            | - |
| Progress circle  | Finished    | >= 0.1.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/progress-circle/README.md)   | - |
| Select           | Finished    | >= 0.1.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/select/README.md)            | - |
| Tile             | Finished    | >= 0.1.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/tile/README.md)              | - |
| Theming          | Finished    | >= 0.2.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/theming/README.md)           | - |
| Context menu     | Finished    | >= 0.2.0    | [Docs](https://github.com/Dynatrace/ngx-groundhog/blob/master/src/lib/context-menu/README.md)      | - |
| Expandable       | In-progress | - | - | #47 |
| Checkbox         | In-progress | - | - | #12 / #53 |
| Datepicker       | In-progress | - | - | #49 / #34 |

## Getting started

#### Step 1: Install the ngx-groundhog and Angular CDK
`npm install --save @dynatrace/ngx-groundhog @angular/cdk`    
or      
`yarn add @dynatrace/ngx-groundhog @angular/cdk`

#### Step 2: Animations
Some ngx-groundhog components depend on the Angular animations module.
If you want these animations to work in your app, you have to install the `@angular/animations` module and include the `BrowserAnimationsModule` in your app.    

`npm install --save @angular/animations`    
or      
`yarn add @angular/animations`

```ts
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [BrowserAnimationsModule],
  ...
})
export class AppModule { }
```

If you don't want to add another dependency to your project, you can use the NoopAnimationsModule.

```ts
import {NoopAnimationsModule} from '@dynatrace/ngx-groundhog';

@NgModule({
  ...
  imports: [NoopAnimationsModule],
  ...
})
export class AppModule { }
```

**Note:** @angular/animations uses the WebAnimation API that isn't supported by all browsers yet. If you want to support animations in these browsers, you'll have to [include a polyfill](https://github.com/web-animations/web-animations-js).

#### Step 3: Import the component modules

Import the NgModule for each component you want to use:
```ts
import {GhButtonModule, GhSelectModule} from '@angular/material';

@NgModule({
  ...
  imports: [GhButtonModule, GhSelectModule],
  ...
})
export class PizzaPartyAppModule { }
```

Alternatively, you can create a separate NgModule that imports all of the Angular Material components that you will use in your application. You can then include this module wherever you'd like to use the components.

**Note:** Whichever approach you use, be sure to import the Angular Material modules after Angular's BrowserModule, as the import order matters for NgModules.

#### Step 4: Include a theme

Including a theme is **required** to apply all of the core and theme styles to your application.

ngx-groundhog is shipping with multiple themes. Include the one that you are using in your global `styles.css`.

```
@import "~@dynatrace/ngx-groundhob/themes/turquoise.css";
```

If you want to use more themes in your app, import `~@dynatrace/ngx-groundhob/themes/all.css` instead-

## Development

#### Prerequisite
1. Make sure [node.js](https://nodejs.org) (Version 8 or greater) is installed
2. Run `npm install` to install all dependencies

#### Start Demo-App
Run `npm run demo-app` to start the demo-app on a local dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

#### Build
Run `npm run build` to build the project. The build artifacts will be stored in the dist/ directory.

#### Creating a new component
We are working right now on a schema that will do the step for creating a new component automatically (Issue [#6](6))    
Until this Tool has been released use the following steps:
1. Create a new directory in the `lib` folder named with your component's name
2. Create the following files inside this folder
  - `public-api.ts`
  - `index.ts`
  - `<name>-module.ts`
  - `tsconfig-build.json`
3. Add your new components export to the `public-api.ts` inside the `lib` folder
4. Import your newly created `<name>Module` inside the `demo-groundhog-module.ts` file in the `demo-app`folder
5. Create a demo page by creating a folder inside the `demo-app` directory with your component's name and use your component there. 
6. Add a new route in the `demo-app/demo-app/routes.ts` file for your new demo app showcase
7. Add the new route in the `demo-app/demp-app/demo-app.ts` navItem collection.
8. Add the mapping inside the `demo-app/system-config.ts` for the new component. 
