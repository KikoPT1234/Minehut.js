import Collection from "@discordjs/collection"
import { Server, SessionServer } from "./Server"
import { stringify } from "querystring"
import { User } from "./User"
const fetch = require("node-fetch")
export class Session {
    user: User
    id: string
    token: string
    constructor(credentials: LoginCredentials, onceLogged: Function) {
        if (!(credentials && credentials.email && credentials.password)) throw new Error("Invalid credentials.")
        fetch("https://api.minehut.com/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        }).then(async (session: {[key: string]: any}) => {
            if (session.status === 401) throw new Error("Invalid email and/or password.")
            session = await session.json()
            this.id = session.sessionId
            this.token = session.token
            let user = await this.fetch(`https://api.minehut.com/user/${session._id}`)
            user = (await user.json()).user
            this.user = new User(user, this)
            this.user.servers = new Collection()
            let servers = await this.fetch(`https://api.minehut.com/servers/${this.user.id}/all_data`)
            servers = await servers.json()
            servers = servers.map((server: Server) => new SessionServer(server, this.user, this))
            servers.forEach((server: SessionServer) => this.user.servers.set(server.id, server))
            onceLogged()
        })
    }
    async fetch(url: string, method?: string, body?: Object) {
        if (!(this.id && this.token)) throw new Error("Credentials not found.")
        const settings: {[key: string]: any} = {
            method: method || "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token,
                "X-Session-Id": this.id
            },
            body: undefined
        }
        if (body) settings.body = JSON.stringify(body)
        const response = await fetch(url, settings)
        return response
    }
}