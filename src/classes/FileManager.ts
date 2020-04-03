import { SessionServer } from "./Server";
import { Session } from "./Session";
import { User } from "./User";
import { APIError } from "./APIError"
import { pathToFileURL } from "url";
const fetch = require("node-fetch")
const FormData = require("form-data")
const fs = require("fs")
const watch = require("node-watch")
const Path = require("path")

export class FileManager {
    server: SessionServer
    session: Session
    user: User
    constructor(server: SessionServer) {
        this.server = server
        this.session = server.session
        this.user = server.owner
    }

    async createFile(path: string | null, name: string) {
        if (!name) throw new Error("Name not provided.")
        if (this.server.isOffline()) throw new Error("Service is offline.")
        if (path) {
            path = path.replace(/^\//, "")
            path = path.replace(/\/$/, "")
        }
        name = name.replace(/^\//, "")
        const response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/edit/${path || ""}/${name}`, "POST", {
            content: ""
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async editFile(path: string, content: string) {
        if (!path) throw new Error("Path not provided.")
        if (this.server.isOffline()) throw new Error("Service is offline.")
        path = path.replace(/^\//, "")
        const response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/edit/${path}`, "POST", {
            content
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async watch(watchPath: string, uploadPath: string = "plugins/Skript/scripts/") {
        if (watchPath === null || uploadPath === null) throw new Error("Watch and/or upload paths not specified.")
        watchPath = watchPath.replace(/\\/g, "/")
        if (this.server.isOffline()) throw new Error("Service offline.")
        const update = async (path: string) => {
            if (fs.lstatSync(path).isFile()) fs.readFile(path, {encoding: "utf8"}, async (err: Error, content: string) => {
                if (err) throw err
                await this.editFile(`${uploadPath}${path.replace(watchPath, "").replace(/^\.\//g, "").replace(/\/\/+/, "")}`, content)
            })
            else fs.readdir(path, async (err: Error, files: string[]) => {
                if (err) throw err
                await this.createDir(`${uploadPath}${path.replace(watchPath, "").replace(/^\.\//g, "").replace(/\/\/+/, "")}`).catch(e => {})
                files.forEach(file => {
                    update(`${path}/${file}`)
                })
            })
        }
        const e = new Error()
        const path = Path.join(Path.dirname(e.stack.split("\n")[2].replace(/ +at /g, "").replace(/:\d+:\d+$/, "")), watchPath)
        const promiseArray: Promise<void>[] = []
        if (!fs.lstatSync(watchPath).isFile()) {
            await fs.readdir(path, (err: Error, files: string[]) => {
                if (err) throw err
                files.forEach(file => promiseArray.push(update(`${watchPath}/${file}`)))
            })
            await Promise.all(promiseArray)
        } else {
            fs.readFile(watchPath, {encoding: "utf8"}, async (err: Error, content: string) => {
                if (err) throw err
                await this.editFile(`${uploadPath}/${Path.basename(watchPath)}`, content).catch(e => {throw e})
            })
        }
        console.log("Now watching...")
        watch(path, {recursive: true}, async (event: string, file: string) => {
            await this.server.refresh()
            if (this.server.isOffline()) throw new Error("Service offline.")
            if (event === "update") {
                let response: Response
                if (fs.lstatSync(file).isFile()) fs.readFile(file, {encoding: "utf8"}, async (err: Error, content: string) => {
                    if (err) throw err
                    await this.editFile(`${uploadPath}/${Path.basename(file)}`, content).catch(e => {throw e})
                    console.log(`${event.toUpperCase()} - ${Path.resolve(watchPath)} -> ${uploadPath}/${Path.basename(file)}`)
                })
                else {
                    await this.createDir(`${uploadPath}${file.replace(path, "")}`)
                    await fs.readdir(path, (err: Error, files: string[]) => {
                        files.forEach(file => update(`${watchPath}/${file}`))
                    })
                    console.log(`${event.toUpperCase()} - ${watchPath}/${file} -> ${uploadPath}${file.replace(path, "")}`)
                }
            } else {
                await this.deleteFile(`${uploadPath}/${Path.basename(watchPath)}`).then(() => {
                    console.log(`${event.toUpperCase()} - ${Path.resolve(watchPath)} -> ${uploadPath}/${Path.basename(file)}`)
                }).catch(async () => {
                    await this.deleteDir(`${uploadPath}${file.replace(path, "").replace(/\\/g, "/")}`).then(() => {
                        console.log(`${event.toUpperCase()} - ${file} -> ${uploadPath}${file.replace(path, "")}`)
                    }).catch(e => {throw e})
                })
            }
        })
    }

    async readFile(path: string) {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        if (!path) throw new Error("Path not provided.")
        path = path.replace(/^\//, "")
        let response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/read/${path}`)
        const body = await response.json()
        if (body.error) throw new APIError(body.error.replace("Error: ", ""))
        if (!body.content) throw new Error("File not found.")
        return body.content
    }

    async deleteFile(path: string) {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        if (!path) throw new Error("Path not provided.")
        path = path.replace(/^\//, "")
        let response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/delete/${path}`, "POST")
        const body = await response.json()
        if (body.error) throw new APIError(body.error.replace("Error: ", ""))
        return
    }

    async readDir(path?: string) {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        if (path) path = path.replace(/^\//, "")
        let response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/list/${path || ""}`)
        const body = await response.json()
        if (body.error) throw new APIError(body.error.replace("Error: ", ""))
        if (!body.files || body.files.length === 0) throw new Error("Directory not found.")
        return body.files
    }

    async deleteDir(path: string) {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        if (!path) throw new Error("Path not provided.")
        await this.server.refresh()
        path = path.replace(/^\//, "")
        let pathArray = path.split("/")
        const body = {
            directory: pathArray.filter((p, i) => i !== pathArray.length - 1).join("/"),
            name: pathArray[pathArray.length - 1]
        }
        let response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/folder/delete`, "POST", body)
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async createDir(path?: string) {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        if (!path) throw new Error("Path not provided.")
        await this.server.refresh()
        path = path.replace(/^\//, "")
        let pathArray = path.split("/")
        const body = {
            directory: pathArray.filter((p, i) => i !== pathArray.length - 1).join("/"),
            name: pathArray[pathArray.length - 1]
        }
        let response = await this.session.fetch(`https://api.minehut.com/file/${this.server.id}/folder/create`, "POST", body)
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async uploadWorld(path: string) {
        if (!path) throw new Error("Data not specified.")
        if (this.server.isOffline()) throw new Error("Service is offline.")
        const e = new Error()
        path = Path.join(Path.dirname(e.stack.split("\n")[2].replace(/ +at /g, "").replace(/:\d+:\d+$/, "")), path)
        const formData = new FormData()
        formData.append("file", fs.createReadStream(path))
        const response = await fetch(`https://api.minehut.com/file/world/upload/${this.server.id}`, {
            method: "POST",
            headers: {
                "Authorization": this.session.token,
                "X-Session-Id": this.session.id,
                ...formData.getHeaders()
            },
            body: formData
        })
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async saveWorld() {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/save`, "POST")
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async resetWorld() {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/reset_world`, "POST")
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async repairFiles() {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/repair_files`, "POST")
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }

    async resetServer() {
        if (this.server.isOffline()) throw new Error("Service is offline.")
        const response = await this.session.fetch(`https://api.minehut.com/server/${this.server.id}/reset_all`, "POST")
        const {error} = await response.json()
        if (error) throw new APIError(error.replace("Error: ", ""))
        return
    }
}