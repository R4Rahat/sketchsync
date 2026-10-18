import jwt from 'jsonwebtoken'

export function requiredAuth(req, res, next){
    const [schema, token] = (req.headers.authorization || ' ').split(' ')

    if(schema !== 'Bearer' || !token){
        return res.status(401).json({
            message:"Not authenticated"
        })
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = payload.sub;
        next()
    } catch (error) {
        req.status(401).json({message:"Access token expired or invalid"})
    }
}

// req.headers.authorization = "Bearer abc123";