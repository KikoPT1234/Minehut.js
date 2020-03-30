const fetch = require("node-fetch")
import Collection from "@discordjs/collection"
import {Server} from "./classes/Server"
import {Session} from "./classes/Session"
import {Icon} from "./classes/Icon"
import {Plugin} from "./classes/Plugin"
import {MHServerObj} from "./interfaces/MHServerObj"
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
    async getServer(name: string) {
        let server = await fetch(`https://api.minehut.com/server/${name}${name.length !== 24 ? "?byName=true" : ""}`)
        server = await server.json()
        if (server.error) throw new Error(server.error.replace("Error: ", ""))
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
    async getPlugin(name: string) {
        const plugins = await this.getPlugins()
        const plugin: Plugin = name.length !== 24 ? plugins.find((p: Plugin) => p.name.toLowerCase() === name.toLowerCase()) : plugins.get(getId(name))
        if (!plugin) throw new Error("Plugin not found.")
        return plugin
    },
    async getIcons(available: boolean = false) {
        let icons = await fetch(`https://api.minehut.com/servers/${available ? "available_icons" : "icons"}`)
        icons = await icons.json()
        const collection: Collection<ID, Icon> = new Collection()
        icons.forEach((icon: {[key: string]: any} | Icon) => {
            icon = new Icon(icon)
            collection.set(getId(icon.id), icon as Icon)
        })
        return collection
    },
    async getIcon(name: string) {
        const icons = await this.getIcons()
        const icon: Icon = name.length !== 24 ? icons.find((i: Icon) => i.iconName === name) : icons.get(getId(name))
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