const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    console.log(err)

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : `Internal Server Error`
    })

}


export default errorMiddleware