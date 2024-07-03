 /**
     * This is a custom error class that extends built-in Error class.
     * It is used to create custom error objects with additional properties.
     * @extends Error
     */

class ErrorHandler extends Error {
    statusCode: Number;
    constructor(message:any, statusCode:Number){
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;