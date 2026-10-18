const notFound = (req, res, next) => {
    // console.log("req:", req);
    res.status(404).json({
        success: false,
        message:`Route not found ${req.originalUrl} ${req.method}`
    })
}

export default notFound