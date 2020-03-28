# Minehut.js

## About
Minehut.js is a Node module that allows you to interact with the Minehut API.

## Collections
The library uses the `Collection` class from Discord.js due to its useful methods such as `find()`, `filter()` and `first()`. For more information, check the [Discord.js Documentation](Collection).

## Documentation
The `Minehut` object contains some methods and properties:

* [`Session`](#session)
* [`getServers()`](#getservers)
* [`getServer(name: string, byName: string = true)`](#getserver)
* [`getPlugins()`](#getplugins)
* [`getPlugin(name: string, byName: string = true)`](#getplugin)
* [`getIcons()`](#geticons)
* [`getIcon(name: string, byName: string = true)`](#geticon)

### Session

**Type:** `Session`

### getServers()

**Returns:** [`Promise`](Promise)<[`Collection`](Collection)<[`string`](String), `Server`>>`

### getServer()

| Parameter     | Type          | Default | Description                      |
| ------------- |---------------|--------:|----------------------------------|
| `name`        | `string`      |         | The ID or name of the server.    |
| `byName`      | `boolean`     | `true`  | Whether to search by name or not |

**Returns:** `Promise<Collection<string, Server>>`

### getPlugins()

**Returns:** `Promise<Collection<string, Plugin>>`

### getPlugin()

| Parameter     | Type          | Default | Description                      |
| ------------- |---------------|--------:|----------------------------------|
| `name`        | `string`      |         | The ID or name of the plugin.    |
| `byName`      | `boolean`     | `true`  | Whether to search by name or not |

**Returns:** `Promise<Plugin>`

### getIcons()

**Returns:** `Promise<Collection<string, Icon>>`

### getPlugin()

| Parameter     | Type          | Default | Description                      |
| ------------- |---------------|--------:|----------------------------------|
| `name`        | `string`      |         | The ID or name of the icon.      |
| `byName`      | `boolean`     | `true`  | Whether to search by name or not |

**Returns:** `Promise<Icon>`

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Collection]: https://discord.js.org/#/docs/collection/master/class/Collection
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String