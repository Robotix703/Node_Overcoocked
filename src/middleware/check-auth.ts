import { Response } from "express";
const jwt = require("jsonwebtoken");

export default function (req: any, res: Response, next: any) {
    try{
        const token : string = req.headers.authorization.split(" ")[1];
        const decodedToken : any =  jwt.verify(token, process.env.JWT);
    
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();

    } catch (error) {
        res.status(401).send(error);
    }
}