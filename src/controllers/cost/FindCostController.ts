import { Request, Response } from "express";
import { FindCostService } from "../../services/cost/FindCostService";

export class FindCostController{
    async handle(req: Request, res: Response){
        const service = new FindCostService()
        const findService = await service.execute()
        return res.send(findService)
    }
}