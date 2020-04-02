import Collection from "@discordjs/collection"
import { Server, SessionServer } from "./Server"
import { stringify } from "querystring"
import { User } from "./User"
import { APIError } from "./APIError"
const fetch = require("node-fetch")
export class Session {
    user: User
    id: string
    token: string
    loggedIn = false
    async login(credentials: LoginCredentials) {
        if (!(credentials && credentials.email && credentials.password)) throw new Error("Invalid credentials.")
        let session: {[key: string]: any} = await fetch("https://api.minehut.com/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        session = await session.json()
        if (session.error) {
            this.loggedIn = false
            throw new APIError(session.error.replace("Error: ", ""))
        }
        this.id = session.sessionId
        this.token = session.token
        this.loggedIn = true
        const response1 = this.fetch(`https://api.minehut.com/user/${session._id}`)
        const response2 = this.fetch(`https://api.minehut.com/user/${session._id}/credit/transactions`)
        const response3 = this.fetch(`https://api.minehut.com/user/${session._id}/payments`)
        let [{user}, {transactions}, {payments}] = await Promise.all((await Promise.all([response1, response2, response3])).map(r => r.json()))
        let transactionCollection = new Collection()
        transactions.forEach((t: {[key: string]: any}) => {
            const newT: {[key: string]: any} = {}
            const id = t._id
            Object.keys(t).forEach(k => {
                let key = k
                if (key === "_id") key = "id"
                if (key === "__v") key = "v"
                key = key.replace(/_(.)/g, e => e[1].toUpperCase())
                newT[key] = t[k]
            })
            transactionCollection.set(id, newT)
        })
        const paymentCollection = new Collection()
        payments.forEach((p: {[key: string]: any}) => {
            const newT: {[key: string]: any} = {}
            const id = p._id
            Object.keys(p).forEach(k => {
                let key = k
                if (key === "_id") key = "id"
                if (key === "__v") key = "v"
                key = key.replace(/_(.)/g, e => e[1].toUpperCase())
                newT[key] = p[k]
            })
            paymentCollection.set(id, newT)
        })
        this.user = new User({
            ...user,
            transactions: transactionCollection,
            payments: paymentCollection
        }, this)
        this.user.servers = new Collection()
        let servers = await this.fetch(`https://api.minehut.com/servers/${this.user.id}/all_data`)
        servers = await servers.json()
        servers = servers.map((server: Server) => new SessionServer(server, this.user, this))
        servers.forEach((server: SessionServer) => this.user.servers.set(server.id, server))
        return this
    }

    async fetch(url: string, method?: string, body?: {[key: string]: any}) {
        if (!this.loggedIn) throw new Error("Not logged in.")
        if (!(this.id && this.token)) throw new Error("Credentials not found.")
        const settings: {[key: string]: any} = {
            method: method || "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token,
                "X-Session-Id": this.id
            }
        }
        if (body) settings.body = JSON.stringify(body)
        const response = await fetch(url, settings)
        return response
    }
}