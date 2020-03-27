"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Server {
    constructor(server) {
        if (!server)
            throw new Error("Server not specified");
        if (!isServer(server))
            throw new Error("Invalid Server.");
        for (let i in server) {
            let key = i;
            let val = server[i];
            if (key === "_id")
                key = "id";
            else if (key === "ip")
                continue;
            else if (key === "active_icon" && server[i]) {
                key = "iconId";
            }
            else if (key === "icon" && server[i]) {
                key = "iconName";
            }
            else if (key === "purchased_icons" && server[i]) {
                key = "purchasedIconIds";
            }
            else if (key === "__v")
                this.v = server[i];
            else if (key === "purchased_plugins") {
                key = "purchasedPluginIds";
            }
            else if (key === "active_plugins") {
                key = "activePluginIds";
            }
            else if (key === "plugins_loaded") {
                key = "loadedPluginIds";
            }
            else if (key === "server_properties") {
                const props = server[i];
                val = {};
                for (let i in props) {
                    val[i.replace(/_(.)/g, e => e[1].toUpperCase())] = props[i];
                }
                key = "serverProperties";
            }
            else
                key = key.replace(/_(.)/g, e => e[1].toUpperCase());
            this[key] = val;
        }
        return;
    }
    async fetchPlugins() {
        const Minehut = require("../index");
        const plugins = await Minehut.getPlugins();
        if (this.activePluginIds)
            this.activePlugins = plugins.filter(p => this.activePluginIds.includes(p.id));
    }
    async fetchIcons() {
        const Minehut = require("../index");
        const icons = await Minehut.getIcons();
        if (!this.purchasedIconIds || (this.purchasedIconIds.length === 0 && !this.iconName && !this.iconId))
            throw new Error("No icon found.");
        if (this.purchasedIconIds)
            this.purchasedIcons = icons.filter(i => this.purchasedIconIds.includes(i.id));
        if (this.iconName)
            this.icon = icons.find(i => i.iconName.toLowerCase() === this.iconName.toLowerCase());
        else if (this.iconId)
            this.icon = icons.get(this.iconId);
    }
}
exports.Server = Server;
function isServer(server) {
    const list = {
        _id: "string",
        owner: "string",
        name: "string",
        name_lower: "string",
        creation: "number",
        platform: "string",
        storage_node: "string",
        __v: "number",
        port: "number",
        last_online: "number",
        motd: "string",
        credits_per_day: "number",
        visibility: "boolean",
        offer: "string",
        server_properties: "object",
        suspended: "boolean",
        icon: "string",
        purchased_icons: "array",
        active_plugins: "array",
        purchased_plugins: "array",
        plugins_loaded: "array",
        online: "boolean",
        maxPlayers: "number",
        playerCount: "number"
    };
    for (let i in list) {
        if (!server[i])
            return false;
        if (list[i] === "array") {
            if (!Array.isArray(server[i]))
                return false;
        }
        else if (typeof server[i] !== list[i])
            return false;
        return true;
    }
}
