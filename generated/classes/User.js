"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("@discordjs/collection");
const Server_1 = require("./Server");
const fetch = require("node-fetch");
class User {
    constructor(user, session) {
        if (!user)
            throw new Error("User not specified.");
        if (!isUser(user))
            throw new Error("Invalid user.");
        if (session)
            this.session = session;
        const Minehut = require("../index");
        for (let i in user) {
            let key = i;
            let val = user[i];
            if (key === "_id")
                key = "id";
            else if (key === "__v")
                key = "v";
            else if (key.includes("minecraft") && !this.minecraft) {
                key = "minecraft";
                val = {
                    linkCode: user.minecraft_link_code,
                    lastLinkTime: user.minecraft_last_link_time,
                    username: user.minecraft_name,
                    uuid: user.minecraft_uuid
                };
            }
            else if (key === "servers")
                key = "serverIds";
            else
                key = key.replace(/_(.)/g, e => e[1].toUpperCase());
            this[key] = val;
        }
        return;
    }
    async fetchServers() {
        if (!this.session)
            throw new Error("Session not found.");
        this.servers = new collection_1.default();
        let servers = await this.session.fetch(`https://api.minehut.com/servers/${this.id}/all_data`);
        servers = await servers.json();
        servers = servers.map(server => new Server_1.SessionServer(server));
        servers.forEach(server => this.servers.set(server.id, server));
    }
}
exports.User = User;
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
    };
    for (let i in list) {
        if (i.includes("minecraft"))
            continue;
        if (!user[i]) {
            return false;
        }
        if (list[i] === "array") {
            if (!Array.isArray(user[i]))
                return false;
        }
        else if (typeof user[i] !== list[i]) {
            return false;
        }
        return true;
    }
}
