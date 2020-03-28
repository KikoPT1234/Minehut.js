# Minehut.js

# About
Minehut.js is a Node module that allows you to interact with the Minehut API.

## Collections
The library uses the `Collection` class from Discord.js due to its useful methods such as `find`, `filter` and `first`. For more information, check the [Discord.js Documentation](https://discord.js.org/#/docs/collection/master/class/Collection).

## Methods
The `Minehut` object contains some methods and properties:\n
`getServers(): Promise<Collection<string, Server>>`\n
`getServer(name: string, byName: string = true): Server`\n
`getPlugins(): Promise<Collection<string, Plugin>>`\n
`getPlugin(name: string, byName: string = true): Plugin`\n
`getIcons(): Promise<Collection<string, Icon>>`\n
`getIcon(name: string, byName: string = true): Icon`\n
`Session: Session`\n