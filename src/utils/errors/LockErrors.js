class MissingParent extends Error {
    constructor(...params) {
        super(...params)
        this.name = 'MissingParent'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingParent)
        }
    }
    
}

class NoPermission extends Error {
    constructor(...params) {
        super(...params)
        this.name = 'NoPermission'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoPermission)
        }
    }
}

class StaleLock extends Error {
    constructor(...params) {
        super(...params)
        this.name = 'StaleLock'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, StaleLock)
        }
    }
}

class LockDenied extends Error {
    constructor(...params) {
        super(...params)
        this.name = 'LockDenied'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, LockDenied)
        }
    }
}


module.exports = { MissingParent, NoPermission, StaleLock, LockDenied }