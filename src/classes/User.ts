import { UserDictionary } from "../interfaces/UserDictionary";
import Collection from "@discordjs/collection";
import { SessionServer, Server } from "./Server";
import { Session } from "./Session";
import { APIError } from "./APIError";
import { MHServerObj } from "../interfaces/MHServerObj";
const fetch = require("node-fetch")

export class User implements UserDictionary {
    session: Session
    id: string
    email: string
    emailVerified: boolean
    emailSentAt: number
    v: number
    emailCode: string
    credits: number
    lastLogin: number
    lastPasswordChange?: number
    minecraft?: {
        linkCode: string
        lastLinkTime: number
        username: string
        uuid: string
    }
    maxServers: number
    serverIds: string[]
    servers: Collection<string, SessionServer>
    transactions: Collection<string, {[key: string]: any}>
    payments: Collection<string, {[key: string]: any}>
    [key: string]: any
    constructor(user: {[key: string]: any}, session: Session) {
        if (!user) throw new Error("User not specified.")
        if (!isUser(user)) throw new Error("Invalid user.")
        if (session) this.session = session
        for (let i in user) {
            let key: string = i
            let val: any = user[i]
            if (key === "_id") key = "id"
            else if (key === "__v") key = "v"
            else if (key.includes("minecraft")) {
                if (this.minecraft) continue
                key = "minecraft"
                val = {
                    linkCode: user.minecraft_link_code,
                    lastLinkTime: user.minecraft_last_link_time,
                    username: user.minecraft_name,
                    uuid: user.minecraft_uuid
                }
            }
            else if (key === "servers") key = "serverIds"
            else key = key.replace(/_(.)/g, e => e[1].toUpperCase())
            this[key] = val
        }
        return
    }

    async createServer(name: string) {
        if (!name) throw new Error("Name not specified.")
        if (name.length > 10) throw new Error("Name too long.")
        const response = await this.session.fetch("https://api.minehut.com/servers/create", "POST", {
            name,
            platform: "java"
        })
        const json = await response.json()        
        if (json.error) throw new APIError(json.error.replace("Error: ", ""))
        const MHServer = json.server
        let [response2, response3] = await getRes(this.session)
        const data = {
            ...response2.server,
            ...response3.status
        }
        const server = new SessionServer(new Server(data), this, this.session)
        this.servers.set(server.id, server)
        return server

        async function getRes(session: Session) {
            const responses: {[key: string]: any}[] = await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const r1 = session.fetch(`https://api.minehut.com/server/${MHServer._id}/server_data`)
                    const r2 = session.fetch(`https://api.minehut.com/server/${MHServer._id}/status`)
                    let responses: any = await Promise.all([r1, r2])
                    responses = await Promise.all(responses.map((r: Response) => r.json()))
                    if (responses.some((r: {[key: string]: any}) => !!r.error)) reject(new APIError(responses.find((r: {[key: string]: any}) => !!r.error).error.replace("Error: ", "")))
                    if (!responses.every((r: {[key: string]: any}) => !!r)) getRes(session).then(resolve)
                    else resolve(responses)
                }, 500)
            })
            return responses
        }
    }

    async purchaseSlots(slots: number = 1) {
        if (!slots || slots < 1 || slots + this.maxServers > 10) throw new Error("Invalid number of slots.")
        if (slots * 400 > this.credits) throw new Error("Not enough credits.")
        const response = await this.session.fetch("https://api.minehut.com/servers/purchase", "POST", {
            server_quantity: slots
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        this.maxServers += slots
        this.credits -= slots * 400
        const response2 = await this.session.fetch(`https://api.minehut.com/user/${this.user.id}/credit/transactions`)
        const transactions = await response2.json()
        let transactionCollection: Collection<string, {[key: string]: any}> = new Collection()
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
        this.transactions = transactionCollection
        return
    }

    async changePassword(oldPassword: string, newPassword: string) {
        if (!oldPassword || !newPassword) throw new Error("New and/or old password not specified.")
        const response = await this.session.fetch("https://api.minehut.com/users/change_password", "POST", {
            email: this.email,
            password: newPassword,
            old_password: oldPassword
        })
        const {error} = await response.json()
        if (error) throw new Error(error.replace("Error: ", ""))
    }

    async refresh() {
        const Minehut = require("../index")
        const response1 = this.session.fetch(`https://api.minehut.com/user/${this.id}`)
        const response2 = this.session.fetch(`https://api.minehut.com/user/${this.id}/credit/transactions`)
        const response3 = this.session.fetch(`https://api.minehut.com/user/${this.id}/payments`)
        let [{MHUser}, {transactions}, {payments}] = await Promise.all((await Promise.all([response1, response2, response3])).map(r => r.json()))
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
            const newP: {[key: string]: any} = {}
            const id = p._id
            Object.keys(p).forEach(k => {
                let key = k
                if (key === "_id") key = "id"
                if (key === "__v") key = "v"
                key = key.replace(/_(.)/g, e => e[1].toUpperCase())
                newP[key] = p[k]
            })
            paymentCollection.set(id, newP)
        })
        const user = {
            ...MHUser,
            transactions: transactionCollection,
            payments: paymentCollection
        }
        for (let i in user) {
            let key: string = i
            let val: any = user[i]
            if (key === "_id") key = "id"
            else if (key === "__v") key = "v"
            else if (key.includes("minecraft")) {
                if (this.minecraft) continue
                key = "minecraft"
                val = {
                    linkCode: user.minecraft_link_code,
                    lastLinkTime: user.minecraft_last_link_time,
                    username: user.minecraft_name,
                    uuid: user.minecraft_uuid
                }
            }
            else if (key === "servers") key = "serverIds"
            else key = key.replace(/_(.)/g, e => e[1].toUpperCase())
            this[key] = val
        }
        this.servers = new Collection()
        let servers = await this.session.fetch(`https://api.minehut.com/servers/${this.id}/all_data`)
        servers = await servers.json()
        servers = servers.map((server: Server) => new SessionServer(server, this, this.session))
        servers.forEach((server: SessionServer) => this.servers.set(server.id, server))
        return
    }
}

function isUser(user: {[key: string]: any}) {
    const list: {
        [key: string]: any
    } = {
        "_id": "string",
        "email": "string",
        "email_verified": "boolean",
        "email_sent_at": "number",
        "__v": "number",
        "email_code": "string",
        "credits": "number",
        "last_login": "number",
        "last_password_change": "number",
        "max_servers": "number",
        "servers": "object",
        "transactions": "object",
        "payments": "object"
    }
    let isValid = true
    Object.keys(list).forEach(k => {
        if (user[k] === undefined) {
            console.log(user[k])
        }
        if (typeof user[k] !== list[k]) {
            isValid = false
        }
    })
    
    return isValid
}