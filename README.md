# lerna-sync-version

> Sync version of lerna packages locally.

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/miguelmota/lerna-sync-version/master/LICENSE)
[![NPM version](https://badge.fury.io/js/lerna-sync-version.svg)](http://badge.fury.io/js/lerna-sync-version)

## Install

```bash
npm install -g lerna-sync-version
```

## Usage

```bash
$ lerna-sync-version [lerna-package-name]
```

### Examples

Sync a package version with all other lerna packages in monorepo:

```bash
$ cd monorepo/

$ lerna-sync-version @acme/foobar
```

Sync current directory package version with all other lerna packages in monrepo:

```bash
$ cd monorepo/packges/foobar/

$ lerna-sync-version
```

## License

[MIT](LICENSE)
