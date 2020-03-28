"use strict";
const fetch = require("node-fetch");
const collection_1 = require("@discordjs/collection");
const Server_1 = require("./classes/Server");
const Session_1 = require("./classes/Session");
const Icon_1 = require("./classes/Icon");
const Plugin_1 = require("./classes/Plugin");
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
        servers.servers.forEach(server => {
            server = new Server_1.Server(server);
            collection.set(getId(server.id), server);
        });
        return collection;
    },
    async getServer(name, byName = true) {
        let server = await fetch(`https://api.minehut.com/server/${name}${byName ? "?byName=true" : ""}`);
        if (server.status === 502)
            throw new Error("Server not found.");
        else if (server.status !== 200)
            throw new Error(`There was an error while trying to fetch ${name}.`);
        server = await server.json();
        const returnServer = new Server_1.Server(server.server);
        return returnServer;
    },
    async getPlugins() {
        let plugins = await fetch("https://api.minehut.com/plugins_public");
        plugins = (await plugins.json()).all;
        const collection = new collection_1.default();
        plugins.forEach(plugin => {
            plugin = new Plugin_1.Plugin(plugin);
            collection.set(getId(plugin.id), plugin);
        });
        return collection;
    },
    async getPlugin(name, byName = true) {
        const plugins = await this.getPlugins();
        const plugin = byName ? plugins.find(p => p.name.toLowerCase() === name.toLowerCase()) : plugins.get(getId(name));
        if (!plugin)
            throw new Error("Plugin not found.");
        return plugin;
    },
    async getIcons() {
        let icons = await fetch("https://api.minehut.com/servers/icons");
        icons = await icons.json();
        const collection = new collection_1.default();
        icons.forEach(icon => {
            icon = new Icon_1.Icon(icon);
            collection.set(getId(icon.id), icon);
        });
        return collection;
    },
    async getIcon(name, byName = true) {
        const icons = await this.getIcons();
        const icon = byName ? icons.find(i => i.iconName === name) : icons.get(getId(name));
        if (!icon)
            throw new Error("Icon not found.");
        return icon;
    },
    async getPlayerCount(separated = false) {
        const res = await fetch("https://api.minehut.com/network/players/distribution");
        const count = await res.json();
        return separated ? count.lobby + count.player_server : {
            lobbies: count.lobby,
            servers: count.player_server
        };
    },
    Session: Session_1.Session
};
module.exports = Minehut;
