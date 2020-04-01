"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = require("./APIError");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
class FileManager {
    constructor(server) {
        this.server = server;
        this.session = server.session;
        this.user = server.owner;
    }
    async createFile(path, name) {
        if (!name)
            throw new Error("Name not provided.");
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        if (path) {
            path = path.replace(/^\//, "");
            path = path.replace(/\/$/, "");
        }
        name = name.replace(/^\//, "");
        const response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/edit/${path || ""}/${name}`, "POST", {
            content: ""
        });
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    }
    async editFile(path, content) {
        if (!path)
            throw new Error("Path not provided.");
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        path = path.replace(/^\//, "");
        const response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/edit/${path}`, "POST", {
            content
        });
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    }
    async readFile(path) {
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        if (!path)
            throw new Error("Path not provided.");
        path = path.replace(/^\//, "");
        let response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/read/${path}`);
        const body = await response.json();
        if (body.error)
            throw new APIError_1.APIError(body.error.replace("Error: ", ""));
        if (!body.content)
            throw new Error("File not found.");
        return body.content;
    }
    async readDir(path) {
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        if (path)
            path = path.replace(/^\//, "");
        let response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/list/${path || ""}`);
        const body = await response.json();
        if (body.error)
            throw new APIError_1.APIError(body.error.replace("Error: ", ""));
        if (!body.files || body.files.length === 0)
            throw new Error("Directory not found.");
        return body.files;
    }
    async uploadWorld(fullPath) {
        if (!fullPath)
            throw new Error("Data not specified.");
        if (!fullPath.match(/\.zip\/*/))
            throw new Error("Only zip files are allowed.");
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        const formData = new FormData();
        formData.append("file", fs.createReadStream(fullPath));
        const response = await fetch(`https://api.minehut.com/file/world/upload/${this.server.id}`, {
            method: "POST",
            headers: {
                "Authorization": this.session.token,
                "X-Session-Id": this.session.id,
                ...formData.getHeaders()
            },
            body: formData
        });
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    }
    async saveWorld() {
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/save`, "POST");
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    }
    async resetWorld() {
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/reset_world`, "POST");
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    }
    async repairFiles() {
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/repair_files`, "POST");
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    }
    async resetServer() {
        if (this.server.isOffline())
            throw new APIError_1.APIError("Service is offline.");
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/reset_all`, "POST");
        const { error } = await response.json();
        if (error)
            throw new APIError_1.APIError(error.replace("Error: ", ""));
        return;
    }
}
exports.FileManager = FileManager;
//# sourceMappingURL=FileManager.js.map