const request = require("node-fetch");
const Session = require("./classes/Session");
const Server = require("./types/Server");
module.exports = {
    Session,
    async all() {
        const res = await request("https://api.minehut.com/servers");
        const servers = (await res.json()).servers;
        return servers;
    },
    async server(idOrName, byName = false) {
        let res;
        if (!byName)
            res = await request(`https://api.minehut.com/server/${idOrName}`);
        else
            res = await request(`https://api.minehut.com/server/${idOrName}?byName=true`);
        if (res.status === 502)
            throw new Error("Server not found.");
        if (res.status !== 200)
            throw new Error(`The server responded with a status code of ${res.status}.`);
        const server = await res.json();
        return server;
    }
};
