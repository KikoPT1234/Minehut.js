import {MHServerObj} from "../interfaces/MHServerObj"
import ServerDictionary from "../interfaces/ServerDictionary"
import {Icon} from "./Icon"
import Collection from "@discordjs/collection"
import {Plugin} from "./Plugin"
import { stringify } from "querystring"
import ServerProperties from "../interfaces/ServerProperties"
import { User } from "./User"
import { Session } from "./Session"
export class Server implements ServerDictionary {
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
    [key: string]: any
    constructor(server: MHServerObj | Server) {
        if (!server) throw new Error("Server not specified")
        if (!(server instanceof Server) && !isServer(server)) throw new Error("Invalid Server.")
        for (let i in server as Object) {
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
                key = "purchasedIconIds"
            }
            else if (key === "__v") key = "v"
            else if (key === "purchased_plugins") {
                key = "purchasedPluginIds"
            }
            else if (key === "active_plugins") {
                key = "activePluginIds"
            }
            else if (key === "plugins_loaded") {
                key = "loadedPluginIds"
            }
            else if (key === "server_properties") {
                const props = server[i]
                val = {}
                for (let i in props) {
                    val[i.replace(/_(.)/g, e => e[1].toUpperCase())] = props[i]
                }
                key = "serverProperties"
            }
            else if (key === "metrics") continue
            else key = key.replace(/_(.)/g, e => e[1].toUpperCase())
            this[key] = val
        }
        return
    }
    async fetchPlugins() {
        const Minehut = require("../index")
        const plugins = await Minehut.getPlugins()
        if (this.activePluginIds) this.activePlugins = plugins.filter((p: {[key: string]: any}) => this.activePluginIds.includes(p.id))
    }
    async fetchIcons() {
        const Minehut = require("../index")
        const icons = await Minehut.getIcons()
        if (!this.purchasedIconIds || (this.purchasedIconIds.length === 0 && !this.iconName && !this.iconId)) throw new Error("No icon found.")
        if (this.purchasedIconIds) this.purchasedIcons = icons.filter((i: {[key: string]: any}) => this.purchasedIconIds.includes(i.id))
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
        if (!server[i]) isValid = false
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
    status: string
    constructor(server: Server, user: User, session: Session) {
        super(server)
        if (!user) throw new Error("User not specified.")
        if (!session) throw new Error("Session not specified.")
        this.owner = user
        this.session = session
    }

    async start() {
        if (this.status !== "OFFLINE" && this.status !== "SERVICE_OFFLINE") throw new Error("Server is already online.")
        const url = `https://api.minehut.com/server/${this.id}/${this.status === "OFFLINE" ? "start" : "start_service"}`
        const response = await this.session.fetch(url, "POST")
        if (response.status === 403 || response.status === 401) throw new Error("Invalid session.")
        if (response.status !== 200) throw new Error("There was an error.")
        return
    }
    async stop(service: boolean = false) {
        if ((!service && this.status === "OFFLINE") || this.status === "SERVICE_OFFLINE") throw new Error("Server is already offline.")
        const url = `https://api.minehut.com/server/${this.id}/${service ? "destroy_service" : "shutdown"}`
        const response = await this.session.fetch(url, "POST")
        if (response.status === 403 || response.status === 401) throw new Error("Invalid session.")
        if (response.status !== 200) throw new Error("There was an error.")
        return
    }

    async sendCommand(command: string) {
        if (!this.online) throw new Error("Server is not online.")
        const response: Response = await this.session.fetch(`https://api.minehut.com/server/${this.id}/send_command`, "POST", {command})
        console.log(response.body)
        if (response.status !== 200) throw new Error(`There was an error while running the command ${command}: ${await response.json()}`)
        return
    }

    async refresh() {
        const response: Response = await this.session.fetch(`https://api.minehut.com/servers/${this.owner.id}/all_data`)
        if (response.status === 403 || response.status === 401) throw new Error("Invalid session.")
        if (response.status !== 200) throw new Error("There was an error.")
        let server = await response.json()
        server = server.find((s: {[key: string]: any}) => s._id === this.id)
        for (let i in server) {
            let key: any = i
            let val: any = server[i]
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
                key = "purchasedIconIds"
            }
            else if (key === "__v") this.v = server[i]
            else if (key === "purchased_plugins") {
                key = "purchasedPluginIds"
            }
            else if (key === "active_plugins") {
                key = "activePluginIds"
            }
            else if (key === "plugins_loaded") {
                key = "loadedPluginIds"
            }
            else if (key === "server_properties") {
                const props = server[i]
                val = {}
                for (let i in props) {
                    val[i.replace(/_(.)/g, e => e[1].toUpperCase())] = props[i]
                }
                key = "serverProperties"
            }
            else if (key === "metrics") continue
            else key = key.replace(/_(.)/g, (e: string) => e[1].toUpperCase())
            this[key] = val
        }
        return
    }
}