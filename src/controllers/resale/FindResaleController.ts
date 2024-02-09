import { Request, Response } from "express";
import { FindResaleService } from "../../services/resale/FindResaleService";

export class FindResaleController{
    async handle(req: Request, res: Response){
        const service = new FindResaleService()
        const resale = await service.execute()
        return res.send(resale)
    }
}