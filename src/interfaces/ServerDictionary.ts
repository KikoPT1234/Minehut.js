import Icon = require("../classes/Icon");
import ServerProperties from "./ServerProperties";
export default interface ServerDictionary {
    id: string
    owner: string
    name: string
    nameLower: string
    creation: number
    platform: string
    storageNode: string
    v: number
    port: number
    lastOnline: number
    MOTD: string
    creditsPerDay: number
    visibility: boolean
    offer: string
    serverProperties: ServerProperties
    suspended: boolean
    purchasedIcons?: Icon[]
    icon?: Icon
    activePlugins: string[]
    purchasedPlugins: string[]
    pluginsLoaded: string[]
    online: boolean
    maxPlayers: number
    playerCount: number
}