class ApiError extends Error {
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack="",
    ){ //...args
        super(message); // calling the parent class constructor
        this.statusCode = statusCode; // setting the status code
        this.data=null; // setting the data to null
        this.message=message; // setting the message
        this.success=false; // setting the success to false
        this.errors = errors; // setting the errors
        if(stack){
            this.stack = stack; // setting the stack
        }else{
            Error.captureStackTrace(this, this.constructor); // capturing the stack trace
        }
    }
}

export { ApiError };