import { Request, Response } from "express";
import { DeleteCostProductService } from "../../services/cost/DeleteCostProductService";

export class DeleteCostProductController {
    async handle(req: Request, res: Response) {
        const id = req.params.id
        const service = new DeleteCostProductService()
        const findService = await service.execute(Number(id))
        return res.send(findService)
    }
}