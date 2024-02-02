import { Request, Response } from "express";
import { DeleteCostService } from "../../services/cost/DeleteCostService";

export class DeleteCostController{
    async handle(req: Request, res: Response){
        const id = req.params.id
        const service = new DeleteCostService()
        const findService = await service.execute(Number(id))
        return res.send(findService)
    }
}