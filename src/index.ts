const fetch = require("node-fetch")
import Server = require("./classes/Server")
import Session = require("./classes/Session")
import Icon = require("./classes/Icon")
import Plugin = require("./classes/Plugin")
import MHServerObj from "./interfaces/MHServerObj"
const Minehut: {
    servers: Server[]
    plugins: Plugin[]
    icons: Icon[]
    init(): Promise<void>
    getServer(name: string | Server, byName?: boolean): Promise<Server>
    getPlugin(name: string, byName?: boolean): Plugin
    getIcon(name: string, byName?: boolean): Icon
    Session: Session
    initialized: boolean
} = {
    Session,
    initialized: false,
    servers: [],
    plugins: [],
    icons: [],
    async getServer(server: Server | string, byName: boolean = true): Promise<Server> {
        if (!this.initialized) throw new Error("Not initialized.")
        let res: Response
        if (server instanceof Server)
            res = await fetch(`https://api.minehut.com/server/${server.id}`)
        else
            res = await fetch(`https://api.minehut.com/server/${server}${byName ? "?byName=true" : ""}`)
        if (res.status !== 200) throw new Error("Server not found.")
        const s = await res.json()
        const returnServer = new Server(s.server)
        return returnServer
    },
    getIcon(name: string, byName: boolean = true): Icon {
        if (!this.initialized) throw new Error("Not initialized.")
        const icon = this.icons.find((i: Icon) => (byName && i.iconName.toLowerCase() === name.toLowerCase()) || (!byName && i.id === name))
        if (!icon) throw new Error("Icon not found.")
        return icon
    },
    getPlugin(name: string, byName: boolean = true) {
        if (!this.initialized) throw new Error("Not initialized.")
        const plugin = this.plugins.find((p: Plugin) => (byName && p.name.toLowerCase() === name.toLowerCase()) || (!byName && p.id === name))
        if (!plugin) throw new Error("Plugin not found.")
        return plugin
    },
    async init(): Promise<void> {
        if (this.initialized) throw new Error("Already initialized.")
        this.initialized = true
        await fetch("https://api.minehut.com/servers/icons")
        .then(r => r.json())
        .then(i => {
            this.icons = i.map(i => new Icon(i))
        })
        await fetch("https://api.minehut.com/plugins_public")
        .then(r => r.json())
        .then(p => {
            this.plugins = p.all.map(p => new Plugin(p))
        })
        await fetch("https://api.minehut.com/servers")
        .then(r => r.json())
        .then(s => {
            this.servers = s.servers.map(s => new Server(s))
        })
        //await Promise.all([icons, plugins, servers])
        return
    }
}
export = Minehut