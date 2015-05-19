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

### Proxy option

If wanting API calls to be proxied to a specific destination, use the `--proxy` flag. By default, all API calls are proxied to `localhost:8080`.

These are all equivalent:

```
gulp
gulp --proxy=default
gulp --proxy=localhost:8080
```

If wanting to use the local Node server (`./server`), located at `localhost:8000`:

```
gulp --proxy=local
```

If wanting to use the default remote server:

```
gulp --proxy=remote
```

If wanting to use other remote servers:

```
gulp --proxy=[IP_ADDRESS:PORT]
```

All preset proxy options are defined in `package.json` under the `proxy` key.

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
