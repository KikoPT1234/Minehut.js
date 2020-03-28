import { UserDictionary } from "../interfaces/UserDictionary";
import Collection from "@discordjs/collection";
import { SessionServer } from "./Server";
import { Session } from "./Session";
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
    servers?: Collection<string, SessionServer>
    constructor(user, session) {
        if (!user) throw new Error("User not specified.")
        if (!isUser(user)) throw new Error("Invalid user.")
        if (session) this.session = session
        const Minehut = require("../index")
        for (let i in user) {
            let key: string = i
            let val: any = user[i]
            if (key === "_id") key = "id"
            else if (key === "__v") key = "v"
            else if (key.includes("minecraft") && !this.minecraft) {
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
    async fetchServers() {
        if (!this.session) throw new Error("Session not found.")
        this.servers = new Collection()
        let servers = await this.session.fetch(`https://api.minehut.com/servers/${this.id}/all_data`)
        servers = await servers.json()
        servers = servers.map(server => new SessionServer(server))
        servers.forEach(server => this.servers.set(server.id, server))
    }
}

function isUser(user) {
    const list = {
        "_id": "string",
        "email": "string",
        "email_verified": "boolean",
        "email_sent_at": "number",
        "__v": "number",
        "email_code": "string",
        "credits": "number",
        "last_login": "number",
        "last_password_change": "number",
        "minecraft_link_code": "string",
        "minecraft_last_link_time": "number",
        "minecraft_name": "string",
        "minecraft_uuid": "string",
        "max_servers": "number",
        "servers": "array"
    }
    for (let i in list) {
        if (i.includes("minecraft")) continue
        if (!user[i]) {
            return false
        }
        if (list[i] === "array") {
            if (!Array.isArray(user[i])) return false
        }
        else if (typeof user[i] !== list[i]) {
            return false
        }
        return true
    }
}