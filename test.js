const Minehut = require("./generated/index")
const session = new Minehut.Session()
session.login({
    email: process.env.EMAIL,
    password: process.env.PASSWORD
}).then(async session => {
    console.log(session.servers)
})