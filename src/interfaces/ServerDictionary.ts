import {Icon} from "../classes/Icon"
import ServerProperties from "./ServerProperties"
import Collection from "@discordjs/collection"
import {Plugin} from "../classes/Plugin"
import { User } from "../classes/User"
export default interface ServerDictionary {
    id: string
    ownerId: string
    name: string
    nameLower: string
    creation: number
    platform: string
    storageNode: string
    v: number
    port: number
    lastOnline: number
    motd: string
    creditsPerDay: number
    visibility: boolean
    offer: string
    properties: ServerProperties
    suspended: boolean
    icons?: Collection<string, Icon>
    iconIds?: string[]
    icon?: Icon
    iconId?: string
    iconName?: string
    online: boolean
    maxPlayers: number
    playerCount: number
    plugins?: Collection<string, Plugin>
    pluginIds: string[]
    fetchPlugins(): Promise<void>
    fetchIcons(): Promise<void>
}