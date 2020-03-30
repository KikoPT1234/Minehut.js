export class APIError extends Error {
    constructor(message: string){
        super(message)
        this.name = "Minehut API Error";
        Error.captureStackTrace(this, APIError);
    }
}