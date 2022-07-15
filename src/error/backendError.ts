export interface IBackendError {
    type: string;
    message: string
}

export interface IJWTError {
    name: string,
    message: string,
    expiredAt: string
}

export const errorTypes = {
    Auth: "Auth"
}

export class BackendError{
    type: string;
    message: string;

    constructor(type: string, message: string){
        this.type = type;
        this.message = message;
    }

    display() : string {
        return this.type + " - " + this.message;
    }
}