type Server = {
    _id: string
    owner: string
    name: string
    name_lower: string
    creation: number
    platform: string
    storage_node: string
    __v: number
    port: number
    last_online: number
    motd: string
    credits_per_day: number
    visibility: boolean
    offer: string
    // @ts-ignore
    server_properties: ServerProperties
    suspended: boolean
    // @ts-ignore
    purchased_icons: Icon[]
    active_plugins: string[]
    purchased_plugins: string[]
    plugins_loaded: string[]
    online: boolean
    maxPlayers: number
    playerCount: number
}