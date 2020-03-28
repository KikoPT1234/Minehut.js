"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
const fetch = require("node-fetch");
class Session {
    constructor(credentials, onceLogged) {
        if (!(credentials && credentials.email && credentials.password))
            throw new Error("Invalid credentials.");
        fetch("https://api.minehut.com/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        }).then(async (session) => {
            if (session.status === 401)
                throw new Error("Invalid email and/or password.");
            session = await session.json();
            this.id = session.sessionId;
            this.token = session.token;
            let user = await this.fetch(`https://api.minehut.com/user/${session._id}`);
            user = (await user.json()).user;
            this.user = new User_1.User(user, this);
            onceLogged();
        });
    }
    async fetch(url, method) {
        if (!(this.id && this.token))
            throw new Error("Credentials not found.");
        const response = await fetch(url, {
            method: method || "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token,
                "X-Session-Id": this.id
            }
        });
        return response;
    }
}
exports.Session = Session;
