const request = require("node-fetch")
const Session = require("./classes/Session")
const Server = require("./types/Server")
module.exports = {
    Session,
    async all(): Promise<Server[]> {
        const res: Response = await request("https://api.minehut.com/servers")
        const servers: Server[] = (await res.json()).servers
        return servers
    },
    async server(idOrName: string, byName: boolean = false): Promise<Server> {
        let res: Response
        if (!byName)
            res = await request(`https://api.minehut.com/server/${idOrName}`)
        else
            res = await request(`https://api.minehut.com/server/${idOrName}?byName=true`)
        if (res.status === 502) throw new Error("Server not found.")
        if (res.status !== 200) throw new Error(`The server responded with a status code of ${res.status}.`)
        const server: Server = await res.json()
        return server
    }
}