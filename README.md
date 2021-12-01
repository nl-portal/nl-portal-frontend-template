# nl-portal-implementation

`nl-portal-implementation` provides a configurable portal implementation for municipalities.

The implementation is built up of reusable components that fit the specifications of the
[NL Design System](https://designsystem.gebruikercentraal.nl/).

The look and feel of these components can be customized through the use of design tokens. Moreover,
the back-end systems with which the implementation communicates can be configured, providing each
municipality with their own unique environment and data.

## Configuration

Environment variables are loaded from [config.js](./public/config.js) by default. Possible
configuration values are specified in the [Config interface](./src/interfaces/config.ts).

These values are set to the window object by [config.js](./packages/app/public/config.js), which
also contains the default values for local development.

_Note: this configuration is empty by default. Please specify its values before running this
project._

### Design tokens

Various components throughout the implementation make use of design tokens as specified by the
[NL Design System](https://designsystem.gebruikercentraal.nl/).

These design tokens are imported in the [App component](./src/components/app/app.tsx).

By default, The Hague design tokens are used, they are imported through the line:

`import '@gemeente-denhaag/design-tokens-components';`

This import can be changed to use a different set of design tokens, changing the look and feel of
the implementation.

Moreover, the implementation uses
[its own set of design tokens](./src/styles/nl-portal-design-tokens.css), which by default refer to
The Hague design tokens. This file can be modified to suit your needs.

### Assets

Assets, such as the header logo, are located in the [assets folder](./src/assets). These files can
be modified to, for example, use your organization's logo.

### PWA assets

This implementation by default supports PWA functionality. After modifying the assets files
mentioned above, use `yarn run generate-pwa-assets` to automatically generate PWA assets (such as a
splash screen) based on these assets.

Moreover, the [manifest.json](./public/manifest.json) file can be modified to, for example, change
your PWA application name.

### Localization

The package `@gemeente-denhaag/nl-portal-localization`, used as a dependency in this implementation,
contains default locales and translations.

These locales and translations can be optionally overridden by modifying the files in the
[i18n folder](./src/i18n).

In the [App component](./src/components/app/app.tsx), these locale and translation files can then be
passed as input to `LocalizationProvider`.

### Footer

The footer of this implementation can be customized inside the
[App component](./src/components/app/app.tsx), by changing the values inside the `footer` variable.
Please make sure to keep to the included `PortalFooter` interface.

Link titles are translated through translation keys, so make sure to include their respective
translations in your assets in the [i18n folder](./src/i18n) under `footerLinks.` and
`footerColumns.`

If you use multiple languages, a link must be specified for each language, their respective
languages are specified by the `hrefLang` property.

### Pages

The pages included in the implementation can be customized. This is automatically reflected in the
routes present in the implementation.

This can be done by changing the `pages` variables in the
[App component](./src/components/app/app.tsx). Please keep to the included `PortalPage` interface.

The icon and component used by each page can be customized.

Each page includes a `titleTranslationKey`, which must refer to an entry in your translation files
in each language you include, i.e. `pageTitles.overview`.

### Keycloak

By default, the implementation is wrapped in `ReactKeycloakProvider` from the package  `@react-keycloak/web`.

Using functionality from this package, like hooks, is supported in the implementation.

Firstly, make sure to include the dependency `@react-keycloak/web` in your implementation.

After including this dependency, hooks like `useKeycloak` can be imported directly from this package and used in your implementation. It automatically works with the Keycloak instance in which the application is wrapped. 

## Development

To contribute to this repository, first [clone](https://git-scm.com/docs/git-clone) it to your
device.

Make sure to [install yarn](https://yarnpkg.com/getting-started/install).

### Installing dependencies

Install dependencies with the command `yarn install` from the project root.

### Starting the project

After installing dependencies, start the project with `yarn run start` from the project root.

### Building

After installing dependencies, build the project with `yarn run build` from the project root.

### Testing

Testing in this project is done with [Jest](https://jestjs.io/). Run the tests of all packages with
`yarn run test` from the project root. To keep watching the tests for any changes, use
`yarn run test:watch`.

### Linting

Testing in this project is done with [ESLint](https://eslint.org/). Look for linting errors in all
packages by running `yarn run lint` from the project root. Use `yarn run lint:fix` to automatically
fix these errors.

### Prettifying

Prettifying in this project is done with [Prettier](https://prettier.io/). Look for formatting
errors in all packages by running `yarn run prettier` from the project root. Use
`yarn run prettier:fix` to automatically fix these errors.

### Adding dependencies

To add a dependency use `yarn add <package-name>` from the project root. For example:
`yarn add jest`.

To add a development dependency, use `yarn add <package-name> --dev` from the project root. For
example: `yarn add jest --dev`.

### @gemeente-denhaag/nl-portal-\* dependencies

This implementation project is based on the @gemeente-denhaag/nl-portal-app package from the
[nl-portal-libraries](https://github.com/Gemeente-DenHaag/nl-portal-libraries) mono repo.
[nl-portal-libraries](https://github.com/Gemeente-DenHaag/nl-portal-libraries) contains the source
code for the nl-portal dependencies needed to run this implementation.

These dependencies present in
[nl-portal-libraries](https://github.com/Gemeente-DenHaag/nl-portal-libraries) are built
automatically and published as NPM packages. Subsequently, they are used in this repository as
dependencies listed in [package.json](./package.json).

To use the latest version of these dependencies, simply up their version numbers in
[package.json](./package.json).

### Tips and guidelines for development

- It is advisable to install IDE plugins for [ESLint](https://eslint.org/) and
  [Prettier](https://prettier.io/). Make sure they use the configurations from the project root. You
  can set the plugins to automatically fix any errors on saving your files.
- Please use TypeScript as much as possible.
- [Use index files for more readable imports.](https://www.bettercoder.io/best-practices/69/use-indexts-to-simplify-imports)
- Please write unit tests for your code.
