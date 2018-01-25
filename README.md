# Angular Groundhog

Home of Dynatrace's component library "Groundhog" for Angular

### Getting started
TODO

#### Available features

| Feature          | Status             | Issue       |
|------------------|--------------------|-------------|
| Button           | In-progress        | [#17](17)   |
| Select           | In-progress        | [#16](16)   |

## Found an Issue?

## Want a Feature?

### Pull-Request
TODO

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
