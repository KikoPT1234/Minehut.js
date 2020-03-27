import IconDictionary from "../interfaces/IconDictionary"
export = class Icon implements IconDictionary {
    id: string
    displayName: string
    iconName: string
    price: number
    rank: string
    available: boolean
    v: number
    disabled: boolean
    created: number
    lastUpdated: number
    constructor(icon) {
        if (!icon) throw new Error("Icon not specified")
        for (let i in icon) {
            let key: any = i
            if (key === "_id") key = "id"
            else if (key === "__v") key = "v"
            else key = key.replace(/_(.)/g, e => e[1].toUpperCase())
            this[key] = icon[i]
        }
    }
}