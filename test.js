const index = require("./public/index.js")
index.server("MedLife", false).then(server => console.log(server)).catch(console.error)