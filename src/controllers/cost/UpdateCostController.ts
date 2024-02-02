import { Request, Response } from "express";
import { UpdateCostService } from "../../services/cost/UpdateCostService";
import { UpdateCostDto } from "../../dto/cost/UpdateCostDto";

export class UpdateCostController {
    async handle(req: Request, res: Response) {
        const {
            id,
            amount,
            name,
            price,
            description
        } = req.body
        
        const dto = new UpdateCostDto()
        const validation = dto.handleValidation({
            id,
            amount,
            name,
            price,
        })
        const service = new UpdateCostService()
        const update = await service.execute({
            id,
            amount,
            name,
            price,
            description
        })
        return res.send(update)
    }
}