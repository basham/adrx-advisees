# AdRx Advisees

Boilerplate code for a [React](http://facebook.github.io/react/) project with a [Reflux](https://github.com/spoike/refluxjs) architecture.

## Installation

Clone and navigate to the repo. Then install [npm](https://www.npmjs.com/) and [Bower](http://bower.io/) packages.

```
npm install
bower install
```

## Developing

Run the development environment through the default [gulp](http://gulpjs.com/) task. Output is located in the `./build` directory.

```
gulp
```

## Build without the development environment

If wanting development output without initiating the environment, run the `build` task. Output is located in the `./build` directory.

```
gulp build
```

## Releasing for production

Build the production release by appending either the `-p` or `--production` flag to the default task. Output is located in the `./release` directory. The development environment will not initiate.

```
gulp -p
```
