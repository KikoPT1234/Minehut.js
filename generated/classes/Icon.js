"use strict";
module.exports = class Icon {
    constructor(icon) {
        if (!icon)
            throw new Error("Icon not specified");
        for (let i in icon) {
            let key = i;
            if (key === "_id")
                key = "id";
            else if (key === "__v")
                key = "v";
            else
                key = key.replace(/_(.)/g, e => e[1].toUpperCase());
            this[key] = icon[i];
        }
    }
};
