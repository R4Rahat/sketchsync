import { request } from 'express';
import mongoose, { Types } from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true
    },
    tokenHash:{
        type:String,
        required:true,
        unique:true,
    },
    expiredAt:{
        type:Date,
        required:true,
        expires:0
    }
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;