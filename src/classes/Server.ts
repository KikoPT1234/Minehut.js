import MHServerObj from "../interfaces/MHServerObj"
import ServerDictionary from "../interfaces/ServerDictionary"
import Icon = require("./Icon")
export = class Server implements ServerDictionary {
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
    // @ts-ignore
    serverProperties: ServerProperties
    suspended: boolean
    purchasedIcons: Icon[]
    icon: Icon
    activePlugins: string[]
    purchasedPlugins: string[]
    pluginsLoaded: string[]
    online: boolean
    maxPlayers: number
    playerCount: number
    constructor(server: MHServerObj) {
        if (!server) throw new Error("Server not specified")
        const Minehut = require("../index")
        for (let i in server) {
            let key: any = i
            let val: any = server[i]
            if (key === "motd") key = "MOTD"
            else if (key === "_id") key = "id"
            else if (key === "ip") continue
            else if (key === "icon" && server[i]) {
                val = Minehut.getIcon(server[i])
                key = "icon"
            }
            else if (key === "active_icon" && server[i]) {
                val = Minehut.getIcon(server[i], false)
                key = "icon"
            }
            else if (key === "purchased_icons" && server[i]) {
                val = server[i].map(i => Minehut.getIcon(i, false))
                key = "purchasedIcons"
            }
            else if (key === "__v") this.v = server[i]
            else if (key === "purchased_plugins") {
                val = server[i].map(p => Minehut.getPlugin(p, false))
                key = "purchasedPlugins"
            }
            else if (key === "active_plugins") {
                val = server[i].map(p => Minehut.getPlugin(p, false))
                key = "activePlugins"
            }
            else if (key === "plugins_loaded") {
                val = server[i].map(p => Minehut.getPlugin(p, false))
                key = "loadedPlugins"
            }
            else if (key === "server_properties") {
                const props = server[i]
                val = {}
                for (let i in props) {
                    val[i.replace(/_(.)/g, e => e[1].toUpperCase())] = props[i]
                }
                key = "serverProperties"
            }
            else key = key.replace(/_(.)/g, e => e[1].toUpperCase())
            this[key] = val
        }
    }
}