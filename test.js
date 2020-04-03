const Minehut = require("./generated/index")
const session = new Minehut.Session()
require("dotenv").config()
session.login({
    email: process.env.EMAIL,
    password: process.env.PASSWORD
}).then(async session => {
    await session.user.servers.first().start().catch(async () => await session.user.servers.first().stop().catch(console.error))
})
