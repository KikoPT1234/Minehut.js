# Minehut.js

## IMPORTANT

This package wouldn't have been possible without the help of my friend DeltaRays#0054.

## About

Minehut.js is a TypeScript and JavaScript library that allows you to interact with the Minehut API.

## Release 3.0.0

This release is focused on the [`FileManager`](#filemanager), bringing some features I had forgotten about + the [`.watch()`](#watch) method:

* Added [`FileManager.watch()`](#watch);
* Added [`FileManager.createDir()`](#createdir);
* Added [`FileManager.deleteFile()`](#deletefile);
* Added [`FileManager.deleteDir()`](#deletedir);
* [`FileManager.uploadWorld()`](#uploadworld) now supports relative paths.

**Created by Kiko#6282**

## Collections

The library uses the `Collection` class from Discord.js due to its useful methods such as `.find()`, `.filter()` and `.first()`. For more information, check the [Discord.js Documentation][Collection].

## Example

```typescript
// Start server
import { Session } from "minehut.js"
const session = new Session()
session.login({
    email: "hello@testmail.com",
    password: "codingisawesome"
}).then(async session => {
    const server = session.servers.first()
    await server.start()
}, console.error)
```

## Main Object

The `Minehut` object contains some methods and properties:

* [`.Session`](#session)
* [`.getServers()`](#getservers)
* [`.getServer(name: string)`](#getserver)
* [`.getPlugins()`](#getplugins)
* [`.getPlugin(name: string)`](#getplugin)
* [`.getIcons()`](#geticons)
* [`.getIcon(name: string)`](#geticon)
* [`.getStats()`](#getstats)
* [`.getPromotion()`](#getpromotion)
* [`.signup()`](#signup)
* [`.checkCode()`](#checkcode)
* [`.confirmEmail()`](#confirmemail)

### .Session
See [Session](#session-1)

### .getServers()

**Returns:** [Promise]<[Collection]<[string], [Server](#server)>>

### .getServer()

| Parameter     | Type          | Description                      |
|:-------------:|:-------------:|:--------------------------------:|
| `name`        | [string]?      | The ID or name of the server.   |

**Returns:** [Promise]\<[Server](#Server)>

### .getPlugins()

**Returns:** [Promise]<[Collection]<[string], [Plugin](#Plugin)>>

### .getPlugin()

| Parameter     | Type          | Description                      |
|:-------------:|:-------------:|:--------------------------------:|
| `name`        | [string]?      | The ID or name of the plugin.   |
**Returns:** [Promise]\<[Plugin](#Plugin)>

### .getIcons()

**Returns:** [Promise]<[Collection]<[string], [Icon](#icon)>>

### .getIcon()

| Parameter     | Type          | Description                      |
|:-------------:|:-------------:|:--------------------------------:|
| `name`        | [string]?      | The ID or name of the icon.     |

**Returns:** [Promise]\<[Icon](#icon)>

### .getStats()

**Returns:** [Promise]<[MinehutStats](#minehutstats)>

### .getPromotion()

**Returns:** [Promise]<[Object] { text: [string], link: [string] }>

### .signup()

| Parameter     | Type          | Description                |
|:-------------:|:-------------:|:--------------------------:|
| `email`       | [string]      | The email to sign up with. |
| `birthday`    | [string]      | A date string indicating the birthday. |

**Returns:** [Promise]\<void>

### .checkCode()

| Parameter     | Type          | Description                 |
|:-------------:|:-------------:|:---------------------------:|
| `code`        | [string]      | The code sent to the email from `Minehut.signup()`. |

**Returns:** [Promise]\<void>
**NOTE:** While this method exists, I'm (still) not sure if it is necessary for signing up. Anyways, just to be sure, you should always use [`.signup()`](#signup), [`.checkCode()`](#checkcode) and [`.confirmEmail()`](#confirmemail)

### .confirmEmail()

| Parameter     | Type          | Description                |
|:-------------:|:-------------:|:--------------------------:|
| `code`        | [string]      | The code sent to the email from `Minehut.signup()`. |
| `password`    | [string]      | The password to set for the account. |

**Returns:** [Promise]\<void>

## MinehutStats

Represents an object containing network statistics.

| Property           | Type                                                              |
|:------------------:|:-----------------------------------------------------------------:|
| `serverCount`      | [Object] { online: [number], total: [number] }                    |
| `playerCount`      | [Object] { total: [number], lobbies: [number], servers: [number]} |
| `userCount`        | [number]                                                          |
| `maxServerCount`   | [number]                                                          |
| `ramCount`         | [number]                                                          |
| `maxRam`           | [number]                                                          |

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
| `icons`               | [Collection]<[string], [Icon](#icon)>? |
| `iconIds`             | [string][]?                     |
| `icon`                | [Icon](#icon)?                  |
| `iconId`              | [string]?                       |
| `iconName`            | [string]?                       |
| `online`              | [boolean]                       |
| `maxPlayers`          | [number]                        |
| `playerCount`         | [number]                        |
| `plugins`             | [Collection]<[string], [Plugin](#plugin)>? |
| `pluginIds`           | [string][]                      |

There are also 2 methods: 

### .fetchPlugins()

**Description:** Fetches plugins (doesn't return them, only assigns)<br/>
**Returns:** [Promise]\<void>

### .fetchIcons()

**Description:** Fetches icons (doesn't return them, only assigns)<br/>
**Returns:** [Promise]\<void>

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

`Session` is the class that manages a user's session. The constructor takes no parameters. Instead, after instanciating the class, you should use the `.login()` method to log in:

### .login()

| Parameter     | Type                                             | Description                                                   |
|:-------------:|:------------------------------------------------:|:-------------------------------------------------------------:|
| `credentials` | [Object] { email: [string], password: [string] } | Minehut email and password.                                   |

**Description:** Logs in to Minehut using specified credentials.<br/>
**Returns:** [Promise]<[Session](#session)>

When successfully logged in, you can either use the original variable or the variable resolved by the promise to access the complete [Session](#session) object:

| Property | Type          |
|:--------:|:-------------:|
| `user`   | [User](#user) |
| `id`     | [string]      |
| `token`  | [string]      |
| `loggedIn` | [boolean]   |

There's also a `.fetch()` method, but I don't recommend using it:

### .fetch()

| Parameter | Type                 | Default | Description |
|:---------:|:--------------------:|:-------:|:-----------:|
| `url`     | [string]             |         | The URL to send the request to. |
| `method`  | [string]             | `"GET"` | The request method. |
| `body`    | [Object] \| [string] |         | The request body.

**Description:** Fetches with authorization.<br/>
**Returns:** [Promise]\<[Response]>

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
| `lastPasswordChange` | [number]                                                 |
| `minecraft`          | [Minecraft](#minecraft)                                  |
| `maxServers`         | [number]                                                 |
| `serverIds`          | [string][]                                               |
| `servers`            | [Collection]<[string], [SessionServer](#sessionserver)>  |
| `transactions`       | [Collection]<[string], [Transaction](#transaction)>      |
| `payments`           | [Collection]<[string], [Payment](#payment)>              |

### .changePassword()

| Parameter     | Type     |
|:-------------:|:--------:|
| `oldPassword` | [string] |
| `newPassword` | [string] |

**Description:** Changes the password for the logged in user.<br/>
**Returns:** [Promise]\<void>

### .purchaseSlots()

| Parameter | Type     |
|:---------:|:--------:|
| `slots`   | [number] |

**Description:** Purchases a server slot. 400 credits are required for each slot.<br/>
**Returns:** [Promise]\<void>

### .createServer()

**Description:** Creates a new server using a free slot.<br/>
**Returns:** [Promise]\<void>

### .refresh()

**Description:** Re-fetches properties (doesn't return them, only assigns).<br/>
**Returns:** [Promise]\<void>

## SessionServer

`SessionServer` represents a server belonging to the logged in user. It extends [`Server`](#server) and has

| Property            | Type                        |
|:-------------------:|:---------------------------:|
| `owner`             | [User](#user)               |
| `session`           | [Session](#session-1)       |
| `fileManager`       | [FileManager](#filemanager) |
| `maxRam`            | [number]                    |
| `serviceOnline`     | [boolean]                   |
| `serverIp`          | [string]                    |
| `serverPort`        | [number]                    |
| `timeNoPlayers`     | [number]                    |
| `startedAt`         | [number]                    |
| `stoppedAt`         | [number]                    |
| `starting`          | [boolean]                   |
| `stopping`          | [boolean]                   |
| `exited`            | [boolean]                   |
| `status`            | [string]                    |
| `metrics`           | [Object]                    |
| `transferScheduled` | [boolean]                   |

### .start()

**Description:** Starts the server up.<br/>
**Returns:** [Promise]\<void>

### .restart()

**Description:** Restarts the server.<br/>
**Returns:** [Promise]\<void>

### .stop()

| Parameter | Type      | Default | Description                         |
|:---------:|:---------:|:-------:|:-----------------------------------:|
| `service` | [boolean]? | `true` | Whether to stop the service or not. |

**Description:** Starts the server up.<br/>
**Returns:** [Promise]\<void>

### .setName()

| Parameter | Type     | Description          |
|:---------:|:--------:|:--------------------:|
| `name`    | [string] | The new server name. |

**Description:** Changes the server name.<br/>
**Returns:** [Promise]\<void>

### .setMOTD()

| Parameter | Type     | Description          |
|:---------:|:--------:|:--------------------:|
| `motd`    | [string] | The new server MOTD. |

**Description:** Changes the server MOTD.<br/>
**Returns:** [Promise]\<void>

### .setVisibility()

| Parameter   | Type      | Description                           |
|:-----------:|:---------:|:-------------------------------------:|
| `isVisible` | [boolean] | Whether the server is visible or not. |

**Description:** Changes the server visibility.<br/>
**Returns:** [Promise]\<void>

### .sendCommand()

| Parameter | Type     | Description             |
|:---------:|:--------:|:-----------------------:|
| `command` | [string] | The command to execute. |

**Description:** Sends a command to the server.<br/>
**Returns:** [Promise]\<void>

### .editProperties()

| Parameter    | Type                                             | Description             |
|:------------:|:------------------------------------------------:|:-----------------------:|
| `properties` | [Partial]<[ServerProperties](#serverproperties)> | The properties to edit. |

**Description:** Edits the server properties.<br/>
**Returns:** [Promise]\<void>

### .purchaseIcon()

| Parameter    | Type                      | Description           |
|:------------:|:-------------------------:|:---------------------:|
| `identifier` | [string] \| [Icon](#icon) | The icon to purchase. |

**Description:** Purchases an icon.<br/>
**Returns:** [Promise]\<void>

### .setIcon()

| Parameter    | Type                                | Description           |
|:------------:|:-----------------------------------:|:---------------------:|
| `identifier` | [string] \| [Icon](#icon) \| [null] | The icon to set. Don't specify anything or specify [`null`][null] to set the default icon. |

**Description:** Changes the server's icon.<br/>
**Returns:** [Promise]\<void>

### .installPlugin()

| Parameter    | Type                          | Description           |
|:------------:|:-----------------------------:|:---------------------:|
| `identifier` | [string] \| [Plugin](#plugin) | The plugin to install |

**Description:** Installs a plugin.<br/>
**Returns:** [Promise]\<void>

### .resetPlugin()

| Parameter    | Type                          | Description          |
|:------------:|:-----------------------------:|:--------------------:|
| `identifier` | [string] \| [Plugin](#plugin) | The plugin to reset. |

**Description:** Resets plugin data.<br/>
**Returns:** [Promise]\<void>

### .uninstallPlugin()

| Parameter    | Type                          | Description             |
|:------------:|:-----------------------------:|:-----------------------:|
| `identifier` | [string] \| [Plugin](#plugin) | The plugin to uninstall |

**Description:** Uninstalls a plugin.<br/>
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

**Description:** Creates a file.<br/>
**Returns:** [Promise]\<void>

### .createDir()

| Parameter | Type      | Description             |
|:---------:|:---------:|:-----------------------:|
| `path`    | [string] | The path to the directory. |

**Description:** Creates a directory.<br/>
**Returns:** [Promise]\<void>

### .editFile()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string] | The path to the file **with** its name. |
| `content` | [string] | The new content.                        |

**Description:** Edits a file.<br/>
**Returns:** [Promise]\<void>

### .readFile()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string] | The path to the file **with** its name. |

**Description:** Reads a file, returning its content.<br/>
**Returns:** [Promise]\<[string]>

### .watch()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `watchPath` | [string] | The local path to watch. |
| `uploadPath` | [string]? | The path to upload to. Specify an empty string for the root directory. |

**Description:** Watches a directory/file and uploads it to Minehut on changes/delete. Warning: Deleted files will not sync to Minehut if they're deleted while this method isn't running.<br/>
**Returns:** [Promise]\<void>

### .readDir()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string]? | The path to the directory. Specify an empty string for the root directory. |

**Description:** Reads a directory, returning its children.<br/>
**Returns:** [Promise]\<void>

### .deleteFile()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string]? | The path to the file. |

**Description:** Deletes a file.<br/>
**Returns:** [Promise]\<void>

### .deleteDir()

| Parameter | Type      | Description                            |
|:---------:|:---------:|:--------------------------------------:|
| `path`    | [string]? | The path to the directory. |

**Description:** Deletes a directory.<br/>
**Returns:** [Promise]\<void>

### .uploadWorld()

| Parameter  | Type      | Description                            |
|:----------:|:---------:|:--------------------------------------:|
| `fullPath` | [string] | The path to the **zip** file. |

**Description:** Uploads a world.<br/>
**Returns:** [Promise]\<void>

### .saveWorld()

**Description:** Saves the world.<br/>
**Returns:** [Promise]\<void>

### .resetWorld()

**Description:** Resets the world. Use with caution!<br/>
**Returns:** [Promise]\<void>

### .repairFiles()

**Description:** Repairs the server's files.<br/>
**Returns:** [Promise]\<void>

### .resetServer()

**Description:** Resets the server. Use with caution!<br/>
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

## Minecraft

Object containing information of a user's linked minecraft account.

| Property       | Type     |
|:--------------:|:--------:|
| `linkCode`     | [string] |
| `lastLinkTime` | [number] |
| `username`     | [string] |
| `uuid`         | [string] |

## Transaction

Object containing information about a credit transaction.

| Property    | Type     |
|:-----------:|:--------:|
| `id`        | [string] |
| `user`      | [string] |
| `userEmail` | [string] |
| `ip`        | [string] |
| `desc`      | [string] |
| `type`      | [string] |
| `pluginId`  | [string] | 
| `serverId`  | [string] |
| `price`     | [number] |
| `time`      | [number] |
| `v`         | [number] |

## Payment

Object containing information about a payment.

| Property    | Type     |
|:-----------:|:--------:|
| `id`        | [string] |
| `user`      | [string] |
| `gateway`   | [string] |
| `paymentId` | [string] |
| `price`     | [number] |
| `time`      | [number] |
| `v`         | [number] |
| `email`     | [number] |

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Collection]: https://discord.js.org/#/docs/collection/master/class/Collection
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Response]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[Partial]: https://www.typescriptlang.org/docs/handbook/utility-types.html#partialt
[Null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Null