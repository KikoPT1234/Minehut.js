import PluginDictionary from "../interfaces/PluginDictionary"

export class Plugin implements PluginDictionary {
    id: string
    name: string
    credits: number
    platform: string
    description: string
    details: string
    version: string
    disabled: boolean
    fileName: string
    configFileName: string
    v: number
    created: number
    lastUpdated: number
    [key: string]: any
    constructor(plugin: {[key: string]: any}) {
        if (!plugin) throw new Error("Plugin not specified")
        for (let i in plugin) {
            let key: any = i
            if (key === "_id") key = "id"
            else if (key === "__v") key = "v"
            else if (key === "desc") key = "description"
            else if (key === "desc_extended") key = "details"
            else key = key.replace(/_(.)/g, (e: string) => e[1].toUpperCase())
            this[key] = plugin[i]
        }
    }
}