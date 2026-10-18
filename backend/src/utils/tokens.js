import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const REFRESH_COOKIES = 'refreshToken'
export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const cookieOptions = {
    httpOnly: true,
    secure:process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
}

export function signAccessToken(userId){
    return jwt.sign({},process.env.ACCESS_TOKEN_SECRET,{
        subject:String(userId),
        expiresIn:'15m'
    })
}

export function signRefreshToken(userId){
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET,{
        subject:String(userId),
        expiresIn:'7d',
        jwtid: crypto.randomUUID()
    })
}

export function hashToken(token){
    return crypto.createHash('sha256').update(token).digest('hex')
}