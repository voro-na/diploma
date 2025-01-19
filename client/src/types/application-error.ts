export class RequestError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class NetworkError extends RequestError {
    constructor(message: string) {
        super(message)
    }
}

export class HttpError extends RequestError {
    statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}
