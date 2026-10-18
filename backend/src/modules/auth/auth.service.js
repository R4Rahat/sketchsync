import RefreshToken from "./refreshToken.model.js";
import {
  REFRESH_COOKIES,
  REFRESH_MAX_AGE,
  cookieOptions,
  signAccessToken,
  signRefreshToken,
  hashToken,
} from "../../utils/tokens.js";

export async function issueToken(user, res){
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    await RefreshToken.create({
        userId:user._id,
        tokenHash: hashToken(refreshToken),
        expiredAt: new Date(Date.now() + REFRESH_MAX_AGE)
    })

    res.cookie(REFRESH_COOKIES, refreshToken, {...cookieOptions, maxAge:REFRESH_MAX_AGE})

    res.json({
        accessToken,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    })
}