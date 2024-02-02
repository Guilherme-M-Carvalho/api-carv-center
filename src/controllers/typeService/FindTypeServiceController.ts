import { Request, Response } from "express";
import { FindTypeServiceService } from "../../services/typeService/FindTypeServiceService";

export class FindTypeServiceController{
    async handle(req: Request, res: Response){
        const service = new FindTypeServiceService()
        const typeServices = await service.execute()
        return res.send(typeServices)
    }
}