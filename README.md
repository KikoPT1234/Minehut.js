# Minehut.js

## IMPORTANT
This package wouldn't have been possible without the help of my friend DeltaRays#0054.

## About

Minehut.js is a TypeScript and JavaScript library that allows you to interact with the Minehut API.

**Created by Kiko#6282**

## Collections

The library uses the `Collection` class from Discord.js due to its useful methods such as `.find()`, `.filter()` and `.first()`. For more information, check the [Discord.js Documentation][Collection].

## Example

```javascript
// Start server
const Minehut = require("minehut.js")
const session = new Minehut.Session({
    email: "hello@testmail.com",
    password: "codingisawesome"
}, async () => {
    const server = session.servers.first()
    await server.start()
})
```

## Main Object

The `Minehut` object contains some methods and properties:

* [`Session`](#session)
* [`getServers()`](#getservers)
* [`getServer(name: string)`](#getserver)
* [`getPlugins()`](#getplugins)
* [`getPlugin(name: string)`](#getplugin)
* [`getIcons()`](#geticons)
* [`getIcon(name: string)`](#geticon)

### Session
See [Session](#session-1)

### .getServers()

**Returns:** [Promise]<[Collection]<[string], [Server](#server)>>

### .getServer()

| Parameter     | Type          | Description                      |
|:-------------:|:-------------:|:--------------------------------:|
| `name`        | [string]?      | The ID or name of the server.    |

**Returns:** [Promise]\<[Server](#Server)>

### .getPlugins()

**Returns:** [Promise]<[Collection]<[string], [Plugin](#Plugin)>>

### .getPlugin()

| Parameter     | Type          | Description                      |
|:-------------:|:-------------:|:--------------------------------:|
| `name`        | [string]?      | The ID or name of the plugin.    |
**Returns:** [Promise]\<[Plugin](#Plugin)>

### .getIcons()

**Returns:** [Promise]<[Collection]<[string], [Icon](#icon)>>

### .getPlugin()

| Parameter     | Type          | Description                      |
|:-------------:|:-------------:|:--------------------------------:|
| `name`        | [string]?      | The ID or name of the icon.      |

**Returns:** [Promise]\<[Icon](#icon)>

## Server

The `Server` class represents a Minehut server accessible with no authorization required. The structure is as follows:

| Property              | Type                            |
|:---------------------:|:-------------------------------:|
| `id`                  | [string]                        |
| `ownerId`             | [string]                        |
| `name`                | [string]                        |
| `nameLower`           | [string]                        |
| `creation`            | [number]                        |
| `platform `           | [string]                        |
| `storageNode`         | [string]                        |
| `v`                   | [number]                        |
| `port`                | [number]                        |
| `lastOnline`          | [number]                        |
| `motd`                | [string]                        |
| `creditsPerDay`       | [number]                        |
| `visibility`          | [boolean]                       |
| `offer`               | [string]                        |
| `properties`          | [ServerProperties](#serverproperties) |
| `suspended`           | [boolean]                       |
| `icons`      | [Collection]<[string], [Icon](#icon)>? |
| `iconIds`    | [string][]?                     |
| `icon`                | [Icon](#icon)?                  |
| `iconId`              | [string]?                       |
| `iconName`            | [string]?                       |
| `online`              | [boolean]                       |
| `maxPlayers`          | [number]                        |
| `playerCount`         | [number]                        |
| `plugins`       | [Collection]<[string], [Plugin](#plugin)>? |
| `pluginIds`     | [string][]                      |

There are also 2 methods: 

* `.fetchPlugins(): Promise<void>` - Fetches plugins (doesn't return them)
* `.fetchIcons(): Promise<void>` - Fetches icons (doesn't return them)

The reason these exist is because Minehut.js doesn't store the plugins and icons as their respective class instances right away, which also explains why some plugin and icon properties are marked as partial.

## Plugin

The `Plugin` class is one that doesn't have many uses. Instead, it exists just for the sake of having it.

| Property         | Type    |
|:----------------:|:-------:|
| `id`             | [string]  |
| `name`           | [string]  |
| `credits`        | [number]  |
| `platform`       | [string]  |
| `description`    | [string]  |
| `details`        | [string]  |
| `version`        | [string]  |
| `disabled`       | [boolean] |
| `fileName`       | [string]  |
| `configFileName` | [string]  |
| `v`              | [number]  |
| `created`        | [number]  |
| `lastUpdated`    | [number]  |

## Icon

Like the `Plugin` class, the icon class also exists just for the sake of it.

| Property      | Type      |
|:-------------:|:---------:|
| `id`          | [string]  |
| `displayName` | [string]  |
| `iconName`    | [string]  |
| `price`       | [number]  |
| `rank`        | [string]  |
| `available`   | [boolean] |
| `v`           | [number]  |
| `disabled`    | [boolean] |
| `created`     | [number]  |
| `lastUpdated` | [number]  |

## Session

`Session` is the class that manages a user's session. The constructor is the following:

```typescript
new Minehut.Session(credentials: Object { email: string, password: string }, callback: Function)
```

| Parameter     | Type                                       | Description                                                   |
|:-------------:|:------------------------------------------:|:-------------------------------------------------------------:|
| `credentials` | Object { email: [string], password: [string] } | Minehut email and password.                                   |
| `callback`    | [Function]                     | The callback function to execute once successfully logged in. |

Once successfully logged in, the `callback` function will fire, at which point you should have access to all of the properties belonging to `Session`.

| Property | Type          |
|:--------:|:-------------:|
| `user`   | [User](#user) |
| `id`     | [string]      |
| `token`  | [string]      |

There's also a `.fetch()` method, but I don't recommend using it.

* `fetch(url: string, method?: string, body?: Object<any>)` - Fetches with authorization.
    * **Returns:** [Promise]\<[Response]>

## User

The `User` class represents a logged in Minehut user.

| Property             | Type                                                     |
|:--------------------:|:--------------------------------------------------------:|
| `session`            | [Session](#session-1)                                    |
| `id`                 | [string]                                                 |
| `email`              | [string]                                                 |
| `emailVerified`      | [boolean]                                                |
| `emailSentAt`        | [number]                                                 |
| `v`                  | [number]                                                 |
| `emailCode`          | [string]                                                 |
| `credits`            | [number]                                                 |
| `lastLogin`          | [number]                                                 |
| `lastPasswordChange` | [number]?                                                |
| `minecraft`          | [Minecraft](#minecraft)?                                 |
| `maxServers`         | [number]                                                 |
| `serverIds`          | [string][]                                               |
| `servers`            | [Collection]<[string], [SessionServer](#sessionserver)>? |

### Minecraft

Object containing information of a user's linked minecraft account.

| Property       | Type     |
|:--------------:|:--------:|
| `linkCode`     | [string] |
| `lastLinkTime` | [number] |
| `username`     | [string] |
| `uuid`         | [string] |

## SessionServer

`SessionServer` represents a server belonging to the logged in user. It extends [`Server`](#server) and only has 2 new properties:

| Property      | Type                        |
|:-------------:|:---------------------------:|
| `owner`       | [User](#user)               |
| `session`     | [Session](#session-1)       |
| `fileManager` | [FileManager](#filemanager) |

It does have a ton of new methods:

### .start()

**Description:** Starts the server up.</br>
**Returns:** [Promise]\<void>

### .restart()

**Description:** Restarts the server.</br>
**Returns:** [Promise]\<void>

### .stop()

| Parameter | Type      | Default | Description                         |
|:---------:|:---------:|:-------:|:-----------------------------------:|
| `service` | [boolean]? | `true` | Whether to stop the service or not. |

**Description:** Starts the server up.</br>
**Returns:** [Promise]\<void>

### .setName()

| Parameter | Type     | Description          |
|:---------:|:--------:|:--------------------:|
| `name`    | [string] | The new server name. |

**Description:** Changes the server name.</br>
**Returns:** [Promise]\<void>

### .setMOTD()

| Parameter | Type     | Description          |
|:---------:|:--------:|:--------------------:|
| `motd`    | [string] | The new server MOTD. |

**Description:** Changes the server MOTD.</br>
**Returns:** [Promise]\<void>

### .setVisibility()

| Parameter   | Type      | Description                           |
|:-----------:|:---------:|:-------------------------------------:|
| `isVisible` | [boolean] | Whether the server is visible or not. |

**Description:** Changes the server visibility.</br>
**Returns:** [Promise]\<void>

### .sendCommand()

| Parameter | Type     | Description             |
|:---------:|:--------:|:-----------------------:|
| `command` | [string] | The command to execute. |

**Description:** Sends a command to the server.</br>
**Returns:** [Promise]\<void>

### .editProperties()

| Parameter    | Type                                             | Description             |
|:------------:|:------------------------------------------------:|:-----------------------:|
| `properties` | [Partial]<[ServerProperties](#serverproperties)> | The properties to edit. |

**Description:** Edits the server properties.</br>
**Returns:** [Promise]\<void>

### .purchaseIcon()

| Parameter    | Type                      | Description           |
|:------------:|:-------------------------:|:---------------------:|
| `identifier` | [string] \| [Icon](#icon) | The icon to purchase. |

**Description:** Purchases an icon.</br>
**Returns:** [Promise]\<void>

### .setIcon()

| Parameter    | Type                                | Description           |
|:------------:|:-----------------------------------:|:---------------------:|
| `identifier` | [string] \| [Icon](#icon) \| [null] | The icon to set. Don't specify anything or specify [`null`][null] to set the default icon. |

**Description:** Changes the server's icon.</br>
**Returns:** [Promise]\<void>

### .installPlugin()

| Parameter    | Type                          | Description           |
|:------------:|:-----------------------------:|:---------------------:|
| `identifier` | [string] \| [Plugin](#plugin) | The plugin to install |

**Description:** Installs a plugin.</br>
**Returns:** [Promise]\<void>

### .resetPlugin()

| Parameter    | Type                          | Description          |
|:------------:|:-----------------------------:|:--------------------:|
| `identifier` | [string] \| [Plugin](#plugin) | The plugin to reset. |

**Description:** Resets plugin data.</br>
**Returns:** [Promise]\<void>

### .uninstallPlugin()

| Parameter    | Type                          | Description             |
|:------------:|:-----------------------------:|:-----------------------:|
| `identifier` | [string] \| [Plugin](#plugin) | The plugin to uninstall |

**Description:** Uninstalls a plugin.</br>
**Returns:** [Promise]\<void>

### .refresh()

**Description:** Re-fetches the server properties.<br/>
**Returns:** [Promise]\<void>

## FileManager

The `FileManager` class is used to manage everything that's file-related, such as world uploading, file creation and resets.

| Property                | Type                            |
|:-----------------------:|:-------------------------------:|
| `user`                  | [User](#user)                   |
| `server`                | [SessionServer](#sessionserver) |
| `session`               | [Session](#session)             |

### .createFile()

| Parameter | Type      | Description             |
|:---------:|:---------:|:-----------------------:|
| `path`    | [string]? | The path to the file **without** its name. Specify an empty string if you're targeting the root directory. |
| `name`    | [string]  | The file name.          |

**Description:** Creates a file.</br>
**Returns:** [Promise]\<void>

### .editFile()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string] | The path to the file **with** its name. |
| `content` | [string] | The new content.                        |

**Description:** Edits a file.</br>
**Returns:** [Promise]\<void>

### .readFile()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string] | The path to the file **with** its name. |

**Description:** Reads a file, returning its content.</br>
**Returns:** [Promise]\<[string]>

### .readDir()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string]? | The path to the directory. Specify an empty string for the root directory. |

**Description:** Reads a directory, returning its children.</br>
**Returns:** [Promise]\<[DirChild](#dirchild)[]>

### .uploadWorld()

| Parameter  | Type      | Description                            |
|:----------:|:---------:|:--------------------------------------:|
| `fullPath` | [string] | The **full path** to the **zip** file. |

**Description:** Uploads a world.</br>
**Returns:** [Promise]\<void>

### .uploadWorld()

| Parameter  | Type      | Description                            |
|:----------:|:---------:|:--------------------------------------:|
| `fullPath` | [string] | The **full path** to the **zip** file. |

**Description:** Uploads a world.</br>
**Returns:** [Promise]\<void>

### .saveWorld()

**Description:** Saves the world.</br>
**Returns:** [Promise]\<void>

### .resetWorld()

**Description:** Resets the world. Use with caution!</br>
**Returns:** [Promise]\<void>

### .repairFiles()

**Description:** Repairs the server's files.</br>
**Returns:** [Promise]\<void>

### .resetServer()

**Description:** Resets the server. Use with caution!</br>
**Returns:** [Promise]\<void>

## DirChild

An object with information about a directory's child element (file or folder).

| Property    | Type       |
|:-----------:|:----------:|
| `name`      | [string]   |
| `directory` | [boolean]  |
| `blocked`   | [boolean]  |

## ServerProperties

The `ServerProperties` type contains all of the properties that servers can have.

| Property                     | Type      |
|:----------------------------:|:---------:|
| `viewDistance`               | [number]  |
| `resourcePackSha1`           | [string]  |
| `resourcePack`               | [string]  |
| `generatorSettings`          | [string]  |
| `levelName`                  | [string]  |
| `levelType`                  | [string]  |
| `announcePlayerAchievements` | [boolean] |
| `enableCommandBlock`         | [boolean] |
| `generateStructures`         | [boolean] |
| `allowNether`                | [boolean] |
| `levelSeed`                  | [string]  |
| `difficulty`                 | [number]  |
| `pvp`                        | [boolean] |
| `hardcore`                   | [boolean] |
| `forceGamemode`              | [boolean] |
| `spawnMobs`                  | [boolean] |
| `spawnAnimals`               | [boolean] |
| `allowFlight`                | [boolean] |
| `gamemode`                   | [number]  |
| `maxPlayers`                 | [number]  |
| `spawnProtection`            | [number]  |

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Collection]: https://discord.js.org/#/docs/collection/master/class/Collection
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Response]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[Partial]: https://www.typescriptlang.org/docs/handbook/utility-types.html#partialt
[Null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Null