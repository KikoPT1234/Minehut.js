# Minehut.js

## About
Minehut.js is a Node module that allows you to interact with the Minehut API.

## Collections
The library uses the `Collection` class from Discord.js due to its useful methods such as `find`, `filter` and `first`. For more information, check the [Discord.js Documentation](https://discord.js.org/#/docs/collection/master/class/Collection).

## Documentation
The `Minehut` object contains some methods and properties:
<ul>
<li>`getServers(): Promise<Collection<string, Server>>`</li>
<li>`getServer(name: string, byName: string = true): Server`</li>
<li>`getPlugins(): Promise<Collection<string, Plugin>>`</li>
<li>`getPlugin(name: string, byName: string = true): Plugin`</li>
<li>`getIcons(): Promise<Collection<string, Icon>>`</li>
<li>`getIcon(name: string, byName: string = true): Icon`</li>
<li>`Session: Session`</li>
</ul>
