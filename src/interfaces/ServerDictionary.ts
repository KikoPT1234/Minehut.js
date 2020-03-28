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
    MOTD: string
    creditsPerDay: number
    visibility: boolean
    offer: string
    serverProperties: ServerProperties
    suspended: boolean
    purchasedIcons?: Collection<string, Icon>
    purchasedIconIds?: string[]
    icon?: Icon
    iconId?: string
    iconName?: string
    online: boolean
    maxPlayers: number
    playerCount: number
    activePlugins?: Collection<string, Plugin>
    activePluginIds: string[]
    purchasedPlugins?: Collection<string, Plugin>
    purchasedPluginIds: string[]
    loadedPlugins?: Collection<string, Plugin>
    loadedPluginIds: string[]
    fetchPlugins(): Promise<void>
    fetchIcons(): Promise<void>
}