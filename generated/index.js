"use strict";
const fetch = require("node-fetch");
const collection_1 = require("@discordjs/collection");
const Server_1 = require("./classes/Server");
const Session_1 = require("./classes/Session");
const Icon_1 = require("./classes/Icon");
const Plugin_1 = require("./classes/Plugin");
const APIError_1 = require("./classes/APIError");
function getId(id) {
    if (id.length !== 24 || id.toLowerCase() !== id)
        throw new TypeError("Not a valid ID.");
    return id;
}
const Minehut = {
    async getServers() {
        let servers = await fetch("https://api.minehut.com/servers");
        servers = await servers.json();
        const collection = new collection_1.default();
        servers.servers.forEach((server) => {
            server = new Server_1.Server(server);
            collection.set(getId(server.id), server);
        });
        return collection;
    },
    async getServer(name) {
        let server = await fetch(`https://api.minehut.com/server/${name}${name.length !== 24 ? "?byName=true" : ""}`);
        server = await server.json();
        if (server.error)
            throw new Error(server.error.replace("Error: ", ""));
        const returnServer = new Server_1.Server(server.server);
        return returnServer;
    },
    async getPlugins() {
        let plugins = await fetch("https://api.minehut.com/plugins_public");
        plugins = (await plugins.json()).all;
        const collection = new collection_1.default();
        plugins.forEach((plugin) => {
            plugin = new Plugin_1.Plugin(plugin);
            collection.set(getId(plugin.id), plugin);
        });
        return collection;
    },
    async getPlugin(name) {
        const plugins = await this.getPlugins();
        const plugin = name.length !== 24 ? plugins.find((p) => p.name.toLowerCase() === name.toLowerCase()) : plugins.get(getId(name));
        if (!plugin)
            throw new Error("Plugin not found.");
        return plugin;
    },
    async getIcons(available = false) {
        let icons = await fetch(`https://api.minehut.com/servers/${available ? "available_icons" : "icons"}`);
        icons = await icons.json();
        const collection = new collection_1.default();
        icons.forEach((icon) => {
            icon = new Icon_1.Icon(icon);
            collection.set(getId(icon.id), icon);
        });
        return collection;
    },
    async getIcon(name) {
        const icons = await this.getIcons();
        const icon = name.length !== 24 ? icons.find((i) => i.iconName === name) : icons.get(getId(name));
        if (!icon)
            throw new Error("Icon not found.");
        return icon;
    },
    async getStats() {
        const simpleStats = fetch("https://api.minehut.com/network/simple_stats");
        const homepageStats = fetch("https://api.minehut.com/network/homepage_stats");
        let [simple, home] = await Promise.all([simpleStats, homepageStats]);
        let count = await fetch("https://api.minehut.com/network/players/distribution");
        count = await count.json();
        simple = await simple.json();
        home = await home.json();
        return {
            serverCount: {
                online: simple.server_count,
                total: home.server_count
            },
            playerCount: {
                total: count.lobby + count.player_server,
                lobbies: count.lobby,
                servers: count.player_server
            },
            userCount: home.user_count,
            maxServerCount: simple.server_max,
            ramCount: simple.ram_count,
            maxRam: simple.ram_max,
        };
    },
    async signup(email, birthday) {
        if (!email || !birthday)
            throw new Error("Email and/or birthday not provided.");
        if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/))
            throw new Error("Invalid email.");
        const date = new Date(birthday);
        if (date.toUTCString() === "Invalid Date")
            throw new Error("Invalid date.");
        const dateString = date.toISOString();
        const response = await fetch("https://api.minehut.com/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                birthday: dateString
            })
        });
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    },
    async checkCode(code) {
        if (!code)
            throw new Error("Code not specified.");
        const response = await fetch("https://api.minehut.com/users/check_email_code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email_code": code
            })
        });
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        console.log(response.status);
        return;
    },
    async confirmEmail(password, code) {
        if (!password || !code)
            throw new Error("Password and/or code not specified.");
        const response = await fetch("https://api.minehut.com/users/confirm_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                "email_code": code
            })
        });
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    },
    async getPromotion() {
        const response = await fetch("https://api.minehut.com/website/navbar/promotion");
        return await response.json();
    },
    Session: Session_1.Session
};
module.exports = Minehut;
