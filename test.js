const Minehut = require("./generated/index")
const servers = Minehut.getServers()
const server = Minehut.getServer("CJRP2")
const icons = Minehut.getIcons()
const icon = Minehut.getIcon("CAKE")
const plugins = Minehut.getPlugins()
const plugin = Minehut.getPlugin("Essentials")
Promise.all([servers, server, icons, icon, plugins, plugin]).then(values => {
    const fetchPlugins = values[1].fetchPlugins()
    const fetchIcons = values[1].fetchIcons()
    Promise.all([fetchPlugins, fetchIcons]).then(values => {
        const session = new Minehut.Session({
            email: "carricokiko2006@gmail.com",
            password: "spacescape1234"
        }, async () => {
            const server = session.user.servers.first()
            await server.editProperties({
                forceGamemode: false,
                viewDistance: 7
            })
            console.log(server.properties.forceGamemode)
        })

    })
}).catch(console.error)