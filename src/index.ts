const fetch = require("node-fetch")
import Collection from "@discordjs/collection"
import {Server} from "./classes/Server"
import {Session} from "./classes/Session"
import {Icon} from "./classes/Icon"
import {Plugin} from "./classes/Plugin"
import {MHServerObj} from "./interfaces/MHServerObj"
import { getServers } from "dns"
type ID = string

function getId(id: string): ID {
    if (id.length !== 24 || id.toLowerCase() !== id) throw new TypeError("Not a valid ID.")
    return id as ID
}

interface Minehut {
    getServers(): Promise<Collection<ID, Server>>
    getServer(name: string, byName: boolean): Promise<Server>
    getPlugins(): Promise<Collection<ID, Plugin>>
    getPlugin(name: string, byName: boolean): Promise<Plugin>
    getIcons(): Promise<Collection<ID, Icon>>
    getIcon(name: string, byName: boolean): Promise<Icon>
    getPlayerCount(separated: boolean): Promise<number | {lobbies: number, servers: number}>

    Session: Function
}

const Minehut: Minehut = {
    async getServers() {
        let servers = await fetch("https://api.minehut.com/servers")
        servers = await servers.json()
        const collection: Collection<ID, Server> = new Collection()
        servers.servers.forEach((server: MHServerObj | Server) => {
            server = new Server(server)
            collection.set(getId(server.id), server as Server)
        })
        return collection
    },
    async getServer(name: string, byName: boolean = true) {
        let server = await fetch(`https://api.minehut.com/server/${name}${byName ? "?byName=true" : ""}`)
        if (server.status === 502) throw new Error("Server not found.")
        else if (server.status !== 200) throw new Error(`There was an error while trying to fetch ${name}.`)
        server = await server.json()
        const returnServer = new Server(server.server)
        return returnServer
    },
    async getPlugins() {
        let plugins = await fetch("https://api.minehut.com/plugins_public")
        plugins = (await plugins.json()).all
        const collection: Collection<ID, Plugin> = new Collection()
        plugins.forEach((plugin: {[key: string]: any} | Plugin) => {
            plugin = new Plugin(plugin)
            collection.set(getId(plugin.id), plugin as Plugin)
        })
        return collection
    },
    async getPlugin(name: string, byName: boolean = true) {
        const plugins = await this.getPlugins()
        const plugin: Plugin = byName ? plugins.find((p: Plugin) => p.name.toLowerCase() === name.toLowerCase()) : plugins.get(getId(name))
        if (!plugin) throw new Error("Plugin not found.")
        return plugin
    },
    async getIcons() {
        let icons = await fetch("https://api.minehut.com/servers/icons")
        icons = await icons.json()
        const collection: Collection<ID, Icon> = new Collection()
        icons.forEach((icon: {[key: string]: any} | Icon) => {
            icon = new Icon(icon)
            collection.set(getId(icon.id), icon as Icon)
        })
        return collection
    },
    async getIcon(name: string, byName: boolean = true) {
        const icons = await this.getIcons()
        const icon: Icon = byName ? icons.find((i: Icon) => i.iconName === name) : icons.get(getId(name))
        if (!icon) throw new Error("Icon not found.")
        return icon
    },
    async getPlayerCount(separated: boolean = false) {
        const res: Response = await fetch("https://api.minehut.com/network/players/distribution")
        const count = await res.json()
        return separated ? count.lobby + count.player_server : {
            lobbies: count.lobby,
            servers: count.player_server
        }
    },
    Session
}
export = Minehut