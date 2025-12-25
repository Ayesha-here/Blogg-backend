import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAuthenticated = async(req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       token = req.headers.authorization.split(' ')[1];//Get token from header by removing 'Bearer ' prefix
    }
    //if we don't have token
    if (!token) {
        return res.status(402).json({ message: 'No token, authorization denied', success: false });
    }
    //if we have token then verify it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password'); //fetch user details except password    
        if(!req.user){
            return res.status(401).json({ message: 'User not found, authorization denied', success: false });
        }
        next();
    }catch(error){
        console.log("error in authentication");
    }
}