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
        }else if (process.env.NODE_ENV === "development") {
            // Only include stack trace in development mode
            Error.captureStackTrace(this, this.constructor); // Capture stack trace if not explicitly passed
        }
        // Adding timestamp for error logging
        this.timestamp = new Date().toISOString();
    }
}

export { ApiError };