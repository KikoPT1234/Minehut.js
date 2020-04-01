import {MHServerObj} from "../interfaces/MHServerObj"
import ServerDictionary from "../interfaces/ServerDictionary"
import {Icon} from "./Icon"
import Collection from "@discordjs/collection"
import {Plugin} from "./Plugin"
import { stringify } from "querystring"
import ServerProperties from "../interfaces/ServerProperties"
import { User } from "./User"
import { Session } from "./Session"
import Minehut = require("..")
import { FileManager } from "./FileManager"
import { APIError } from "./APIError"
export class Server implements ServerDictionary {
    [key: string]: any
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
    pluginIds: string[] = []
    constructor(server: MHServerObj | Server) {
        if (!server) throw new Error("Server not specified")
        if (!(server instanceof Server) && !isServer(server)) throw new Error("Invalid Server.")
        for (let i in server) {
            let key = i
            let val = server[i]
            if (key === "_id") key = "id"
            else if (key === "ip") continue
            else if (key === "active_icon" && server[i]) {
                key = "iconId"
            }
            else if (key === "owner") key = "ownerId"
            else if (key === "icon" && server[i]) {
                key = "iconName"
            }
            else if (key === "purchased_icons" && server[i]) {
                key = "iconIds"
            }
            else if (key === "__v") key = "v"
            else if (key === "purchased_plugins") {
                this.pluginIds.push(...val)
                continue
            }
            else if (key === "active_plugins") {
                this.pluginIds.push(...val)
                continue
            }
            else if (key === "plugins_loaded") {
                continue
            }
            else if (key === "server_properties") {
                const props = server[i]
                val = {}
                for (let i in props) {
                    val[i.replace(/_(.)/g, e => e[1].toUpperCase())] = props[i]
                }
                key = "properties"
            }
            else if (key === "metrics") continue
            else key = key.replace(/_(.)/g, e => e[1].toUpperCase())
            this[key] = val
        }
        return
    }
    async fetchPlugins() {
        const Minehut = require("../index")
        if (this.plugins) throw new Error("Plugins are already fetched.")
        const plugins = await Minehut.getPlugins()
        if (this.pluginIds) this.plugins = plugins.filter((p: {[key: string]: any}) => this.pluginIds.includes(p.id))
    }
    async fetchIcons() {
        const Minehut = require("../index")
        if (this.icons) throw new Error("Icons are already fetched.")
        const icons = await Minehut.getIcons()
        if (!this.iconIds || (this.iconIds.length === 0 && !this.iconName && !this.iconId)) return
        if (this.iconIds) this.icons = icons.filter((i: {[key: string]: any}) => this.iconIds.includes(i.id))
        if (this.iconName) this.icon = icons.find((i: Icon) => i.iconName.toLowerCase() === this.iconName.toLowerCase())
        else if (this.iconId) this.icon = icons.get(this.iconId)
    }
}

function isServer(server: {[key: string]: any}) {
    const list: {
        [key: string]: any
    } = {
        "_id": "string",
        "owner": "string",
        "name": "string",
        "name_lower": "string",
        "creation": "number",
        "platform": "string",
        "storage_node": "string",
        "__v": "number",
        "port": "number",
        "last_online": "number",
        "motd": "string",
        "credits_per_day": "number",
        "visibility": "boolean",
        "offer": "string",
        "server_properties": "object",
        "suspended": "boolean",
        "icon": "string",
        "purchased_icons": "array",
        "active_plugins": "array",
        "purchased_plugins": "array",
        "plugins_loaded": "array",
        "online": "boolean",
        "maxPlayers": "number",
        "playerCount": "number"
    }
    let isValid: boolean | null = null
    Object.keys(list).forEach((i: string) => {
        if (isValid === false) return
        if (server[i] === undefined) isValid = false
        if (list[i] === "array") {
            if (!Array.isArray(server[i])) isValid = false
        }
        else if (typeof server[i] !== list[i]) isValid = false
        isValid = true
    })
    return isValid
}

export class SessionServer extends Server {
    owner: User
    session: Session
    fileManager: FileManager
    status: string
    constructor(server: Server, user: User, session: Session) {
        super(server)
        if (!user) throw new Error("User not specified.")
        if (!session) throw new Error("Session not specified.")
        this.owner = user
        this.session = session
        this.fileManager = new FileManager(this)
    }

    async start() {
        if (this.status !== "OFFLINE" && this.status !== "SERVICE_OFFLINE") throw new Error("Server is already online.")
        const url = `https://api.minehut.com/server/${this.id}/${this.status === "OFFLINE" ? "start" : "start_service"}`
        const response = await this.session.fetch(url, "POST")
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async restart() {
        if (!this.online) throw new Error("Server is not online.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/restart`, "POST")
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async stop(service: boolean = false) {
        if ((!service && this.status === "OFFLINE") || this.isOffline()) throw new Error("Server is already offline.")
        const url = `https://api.minehut.com/server/${this.id}/${service ? "destroy_service" : "shutdown"}`
        const response = await this.session.fetch(url, "POST")
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async setName(name: string) {
        if (!name) throw new Error("Name not specified.")
        if (name.length > 10) throw new Error("Name too long. Maximum is 10 characters")
        if (name.length < 4) throw new Error("Name too short. Minimum is 4 characters")
        if (this.isOffline()) throw new Error("Service is offline.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/change_name`, "POST", {
            name
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        this.name === name
        return
    }

    async setMotd(motd: string) {
        if (!motd) throw new Error("MOTD not specified.")
        if (motd.length > 64) throw new Error("MOTD too long. Maximum is 64 characters")
        if (this.isOffline()) throw new Error("Service is offline.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/change_motd`, "POST", {
            motd
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        this.motd = motd
        return
    }

    async setVisibility(isVisible: boolean) {
        if (!isVisible) throw new Error("Visibility not specified.")
        if (this.isOffline()) throw new Error("Service is offline.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/visibility`, "POST", {
            visibility: isVisible.toString()
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        this.visibility = isVisible
        return
    }

    async sendCommand(command: string) {
        if (!this.online) throw new Error("Server is not online.")
        if (!command) throw new Error("Command not specified.")
        const response: Response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/send_command`, "POST", {command})
        console.log(response.body)
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async editProperties(properties: Partial<ServerProperties>) {
        if (this.isOffline()) throw new Error("Service is offline.")
        const array: Promise<Response>[] = []
        Object.keys(properties).forEach((prop: string) => {
            const body = {
                field: prop.replace(/([A-Z])/g, e => "_" + e.toLowerCase()),
                value: properties[prop]
            }
            array.push(this.session.fetch(`https://api.minehut.com/server/${this.id}/edit_server_properties`, "POST", body))
        })
        const responses = await Promise.all(array)
        if (responses.some(el => el.status === 403 || el.status === 401)) throw new Error("Invalid session.")
        if (responses.some(el => el.status === 400)) throw new Error("Invalid properties.")
        if (responses.some(el => el.status !== 200)) throw new Error("There was an error.")
        Object.keys(properties).forEach((key: string) => {
            this.properties[key] = properties[key]
        })
        return
    }

    async purchaseIcon(identifier: string | Icon) {
        const Minehut = require("../index")
        let id = ""
        if (typeof identifier === "string" && identifier.length !== 24) {
            id = (await Minehut.getIcon(identifier)).id
        }
        else if (identifier instanceof Icon) id = identifier.id
        else id = identifier
        if (this.iconIds.includes(id)) throw new Error("Icon is already owned.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/icon/purchase`, "POST", {
            icon_id: id
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        const icon = await Minehut.getIcon(id)
        this.iconIds.push(id)
        this.icons.set(id, icon)
        return
    }

    async setIcon(identifier: string | Icon | null) {
        const Minehut = require("../index")
        let id = ""
        if (!identifier) id = null
        else if (typeof identifier === "string" && identifier.length !== 24) {
            id = (await Minehut.getIcon(identifier)).id
        }
        else if (identifier instanceof Icon) id = identifier.id
        else id = identifier
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/icon/equip`, "POST", id ? {
            icon_id: id
        } : {})
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        if (id === null) this.iconName, this.iconId, this.icon = null
        else {
            const icon = await Minehut.getIcon(id)
            this.icon = icon
            this.iconId = icon.id
            this.iconName = icon.iconName
        }
        return
    }

    async installPlugin(identifier: string | Plugin) {
        if (this.isOffline()) throw new Error("Service is offline.")
        const Minehut = require("../index")
        let id = ""
        if (!identifier) id = null
        else if (typeof identifier === "string" && identifier.length !== 24) {
            id = (await Minehut.getPlugin(identifier)).id
        }
        else if (identifier instanceof Plugin) id = identifier.id
        else id = identifier
        if (this.pluginIds.includes(id)) throw new Error("Plugin is already installed.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/install_plugin`, "POST", {
            plugin: id
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        const plugin = await Minehut.getPlugin(id)
        this.pluginIds.push(id)
        if (this.plugins && this.plugins.size > 0) this.plugins.set(id, plugin)
        return
    }

    async resetPlugin(identifier: string | Plugin) {
        if (this.isOffline()) throw new Error("Service is offline.")
        const Minehut = require("../index")
        let id = ""
        if (!identifier) id = null
        else if (typeof identifier === "string" && identifier.length !== 24) {
            id = (await Minehut.getPlugin(identifier)).id
        }
        else if (identifier instanceof Plugin) id = identifier.id
        else id = identifier
        if (!this.pluginIds.includes(id)) throw new Error("Plugin is not installed.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/remove_plugin_data`, "POST", {
            plugin: id
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async uninstallPlugin(identifier: string | Plugin) {
        if (this.isOffline()) throw new Error("Service is offline.")
        const Minehut = require("../index")
        let id = ""
        if (!identifier) id = null
        else if (typeof identifier === "string" && identifier.length !== 24) {
            id = (await Minehut.getPlugin(identifier)).id
        }
        else if (identifier instanceof Plugin) id = identifier.id
        else id = identifier
        if (!this.pluginIds.includes(id)) throw new Error("Plugin is already not installed.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/remove_plugin`, "POST", {
            plugin: id
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        delete this.pluginIds[this.pluginIds.indexOf(id)]
        if (this.plugins && this.plugins.size > 0) this.plugins.delete(id)
        return
    }

    isOffline() {
        return this.status.includes("SERVICE")
    }

    async refresh() {
        const response: Response = await this.session.fetch(`https://api.minehut.com/servers/${this.owner.id}/all_data`)
        let server = await response.json()
        if (server.error) throw new APIError(server.error.replace("Error: ", ""))
        server = server.find((s: {[key: string]: any}) => s._id === this.id)
        this.pluginIds = []
        for (let i in server) {
            let key = i
            let val = server[i]
            if (key === "_id") key = "id"
            else if (key === "ip") continue
            else if (key === "active_icon" && server[i]) {
                key = "iconId"
            }
            else if (key === "owner") key = "ownerId"
            else if (key === "icon" && server[i]) {
                key = "iconName"
            }
            else if (key === "purchased_icons" && server[i]) {
                key = "iconIds"
            }
            else if (key === "__v") key = "v"
            else if (key === "purchased_plugins") {
                this.pluginIds.push(...val)
                continue
            }
            else if (key === "active_plugins") {
                this.pluginIds.push(...val)
                continue
            }
            else if (key === "plugins_loaded") {
                continue
            }
            else if (key === "server_properties") {
                const props = server[i]
                val = {}
                for (let i in props) {
                    val[i.replace(/_(.)/g, e => e[1].toUpperCase())] = props[i]
                }
                key = "properties"
            }
            else if (key === "metrics") continue
            else key = key.replace(/_(.)/g, e => e[1].toUpperCase())
            this[key] = val
        }
        await Promise.all([this.fetchIcons(), this.fetchPlugins()])
        return
    }
}