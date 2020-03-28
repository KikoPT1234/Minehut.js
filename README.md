# Minehut.js

## About
Minehut.js is a Node module that allows you to interact with the Minehut API.

## Collections
The library uses the `Collection` class from Discord.js due to its useful methods such as `find`, `filter` and `first`. For more information, check the [Discord.js Documentation](https://discord.js.org/#/docs/collection/master/class/Collection).

## Documentation
The `Minehut` object contains some methods and properties:
..* [`getServers(): Promise<Collection<string, Server>>`](#`getservers()`)
..* `getServer(name: string, byName: string = true): Server`
..* `getPlugins(): Promise<Collection<string, Plugin>>`
..* `getPlugin(name: string, byName: string = true): Plugin`
..* `getIcons(): Promise<Collection<string, Icon>>`
..* `getIcon(name: string, byName: string = true): Icon`
..* `Session: Session`

### `getServers()`

**Returns:** Promise<Collection<string, Server>>