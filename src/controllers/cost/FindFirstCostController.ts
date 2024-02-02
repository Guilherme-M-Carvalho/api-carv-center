import { Request, Response } from "express";
import { FindFirstCostService } from "../../services/cost/FindFirstCostService";

export class FindFirstCostController{
    async handle(req: Request, res: Response){
        const id = req.params.id
        const service = new FindFirstCostService()
        const findService = await service.execute(Number(id))
        return res.send(findService)
    }
}