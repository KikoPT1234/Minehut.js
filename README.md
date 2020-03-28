# Minehut.js

## About
Minehut.js is a Node module that allows you to interact with the Minehut API.

## Collections
The library uses the `Collection` class from Discord.js due to its useful methods such as `find()`, `filter()` and `first()`. For more information, check the [Discord.js Documentation][Collection].

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
* [`getServer(name: string, byName: string = true)`](#getserver)
* [`getPlugins()`](#getplugins)
* [`getPlugin(name: string, byName: string = true)`](#getplugin)
* [`getIcons()`](#geticons)
* [`getIcon(name: string, byName: string = true)`](#geticon)

### Session
See [Session](#session-1)

### getServers()

**Returns:** [Promise]<[Collection]<[string], [Server](#server)>>

### getServer()

| Parameter     | Type          | Default | Description                      |
|:-------------:|:-------------:|:-------:|:--------------------------------:|
| `name`        | `string`      |         | The ID or name of the server.    |
| `byName`      | `boolean`     | `true`  | Whether to search by name or not |

**Returns:** [Promise]\<[Server](#Server)>

### getPlugins()

**Returns:** [Promise]<[Collection]<[string], [Plugin](#Plugin)>>

### getPlugin()

| Parameter     | Type          | Default | Description                      |
|:-------------:|:-------------:|:-------:|:--------------------------------:|
| `name`        | `string`      |         | The ID or name of the plugin.    |
| `byName`      | `boolean`     | `true`  | Whether to search by name or not |

**Returns:** [Promise]\<[Plugin](#Plugin)>

### getIcons()

**Returns:** [Promise]<[Collection]<[string], [Icon](#icon)>>

### getPlugin()

| Parameter     | Type          | Default | Description                      |
|:-------------:|:-------------:|:-------:|:--------------------------------:|
| `name`        | `string`      |         | The ID or name of the icon.      |
| `byName`      | `boolean`     | `true`  | Whether to search by name or not |

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
| `properties`          | [ServerProperties](#serverproperties)                |
| `suspended`           | [boolean]                       |
| `purchasedIcons`      | [Collection]<[string], [Icon](#icon)>?   |
| `purchasedIconIds`    | [string][]?                     |
| `icon`                | [Icon](#icon)?                  |
| `iconId`              | [string]?                       |
| `iconName`            | [string]?                       |
| `online`              | [boolean]                       |
| `maxPlayers`          | [number]                        |
| `playerCount`         | [number]                        |
| `activePlugins`       | [Collection]<[string], [Plugin](#plugin)>? |
| `activePluginIds`     | [string][]                      |
| `purchasedPlugins`    | [Collection]<[string], [Plugin](#plugin)>? |
| `purchasedPluginIds`  | [string][]                      |
| `loadedPlugins`       | [Collection]<[string], [Plugin](#plugin)>? |
| `loadedPluginIds`     | [string][]                      |

There are also 2 methods: 

* `fetchPlugins(): Promise<void>` - Fetches plugins (doesn't return them)
* `fetchIcons(): Promise<void>` - Fetches icons (doesn't return them)

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
| `credentials` | Object { email: string, password: string } | Minehut email and password.                                   |
| `callback`    | [`Function`][Function]                     | The callback function to execute once successfully logged in. |

Once successfully logged in, the `callback` function will fire, at which point you should have access to all of the properties belonging to `Session`.

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