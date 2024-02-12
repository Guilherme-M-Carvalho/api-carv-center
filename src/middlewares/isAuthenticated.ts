import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"

export function isAuthenticated(req: Request, res: Response, next: NextFunction){
    return next()

    const authToken = req.headers.authorization

    if(!authToken){
        return res.status(401).end()
    }

    const [, token] = authToken.split(' ')
    try{
        const response = verify(token, process.env.JWT_SECRET ?? '')
        return next()
    } catch (err){
        return res.status(401).end()
    }
}