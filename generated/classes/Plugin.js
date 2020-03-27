"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor(plugin) {
        if (!plugin)
            throw new Error("Plugin not specified");
        for (let i in plugin) {
            let key = i;
            if (key === "_id")
                key = "id";
            else if (key === "__v")
                key = "v";
            else if (key === "desc")
                key = "description";
            else if (key === "desc_extended")
                key = "details";
            else
                key = key.replace(/_(.)/g, e => e[1].toUpperCase());
            this[key] = plugin[i];
        }
    }
}
exports.Plugin = Plugin;
