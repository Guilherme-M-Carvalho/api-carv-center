import { Request, Response } from "express";
import { FindCostResaleService } from "../../services/cost/FindCostResaleService";

export class FindCostResaleController{
    async handle(req: Request, res: Response){
        const service = new FindCostResaleService()
        const findService = await service.execute()
        return res.send(findService)
    }
}