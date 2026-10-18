import bcrypt from 'bcrypt'
import User from "./user.model.js"
import { issueToken } from './auth.service.js';
import { cookieOptions, hashToken, REFRESH_COOKIES } from '../../utils/tokens.js';
import RefreshToken from './refreshToken.model.js';


export async function register(req, res, next){
    try {
       const {name, email, password} = req.body;

       if(!name || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        })
       } 

       if(password.length < 8){
        return res.status(400).json({message:`Password must be atleast 8 characters`})
       }

       const exists = await User.findOne({email: email.toLowerCase()})

       if(exists){
        return res.status(409).json({message:"Email already in use"})
       }

       const passwordHash = await bcrypt.hash(password, 12)

       const user = User.create({
        name, email, passwordHash
       });

       res.status(201).json({
        user:{
            id:user._id,
            name: user.name,
            email: user.email
        }
       });
    } catch (error) {
       next(error) 
    }
}

export async function login(req, res, next){
    try {
        const {email, password} = req.body;
        if (!email || !password) {
          return res
            .status(400)
            .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({
            email:email.toLowerCase()
        })

        const valid = user && (await bcrypt.compare(password, user.passwordHash))

        if(!valid){
            return res.status(401).json({
                message:`Invalid credentials`
            })
        }

        await issueToken(user, res);
    } catch (error) {
        next(error)
    }
}   

export async function refresh(req, res, next){
    try {
        const token = req.cookies[REFRESH_COOKIES];
        if (!token) return res.status(401).json({message:"Refresh token not found"});

        let payload;
        try {
            payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
           res.clearCookie(REFRESH_COOKIES, cookieOptions); 
           return res.status(401).json({message:"Refresh token expired or invalid"});
        }

        const stored = await RefreshToken.findOneAndDelete({tokenHash:hashToken(token)});

        if(!stored){
            await RefreshToken.deleteMany({userId: payload.sub});
            res.clearCookie(REFRESH_COOKIES, cookieOptions);
            return res
              .status(401)
              .json({ message: "Refresh token reuse detected" });
        }

        const user = await User.findById(payload.sub);
        if(!user){
            return res.status(401).json({message:"User not found"});
        }

        await issueToken(user, res);
    } catch (error) {
        next(error)
    }
}