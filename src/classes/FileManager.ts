import { SessionServer } from "./Server";

export class FileManager {
    server: SessionServer
    constructor(server: SessionServer) {
        this.server = server
    }
}