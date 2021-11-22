# nl-portal-implementation

`nl-portal-implementation` is a package aimed at providing a configurable portal
implementation for municipalities.

The implementation is built up of reusable components that fit the specifications
of the [NL Design System](https://designsystem.gebruikercentraal.nl/).

The look and feel of these components can be customized through the use of design tokens. Moreover,
the back-end systems with which the implementation communicates can be configured, providing each
municipality with their own unique environment and data.

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

To add a dependency use `yarn add <package-name>` from the project root. For example: `yarn add jest`.

To add a development dependency, use `yarn add <package-name> --dev` from the project root. For example: `yarn add jest --dev`.

### @nl-portal dependencies

This implementation project is based on the @nl-portal/app package from the [nl-portal-libraries](https://github.com/Gemeente-DenHaag/nl-portal-libraries) mono repo. [nl-portal-libraries](https://github.com/Gemeente-DenHaag/nl-portal-libraries) contains the source code for the nl-portal dependencies needed to run this implementation.

These dependencies present in [nl-portal-libraries](https://github.com/Gemeente-DenHaag/nl-portal-libraries) are built automatically and published as NPM packages. Subsequently, they are used in this repository as dependencies listed in [package.json](./package.json).

To use the latest version of these dependencies, simply up their version numbers in [package.json](./package.json).

### Tips and guidelines for development

- It is advisable to install IDE plugins for [ESLint](https://eslint.org/) and
  [Prettier](https://prettier.io/). Make sure they use the configurations from the project root. You
  can set the plugins to automatically fix any errors on saving your files.
- Please use TypeScript as much as possible.
- [Use index files for more readable imports.](https://www.bettercoder.io/best-practices/69/use-indexts-to-simplify-imports)
- Please write unit tests for your code.


### Configuration

Environment variables are loaded from [config.js](./public/config.js) by
default. Possible configuration values are specified in the
[Config interface](./src/interfaces/config.ts).

These values are set to the window object by [config.js](./packages/app/public/config.js), which
also contains the default values for local development.
