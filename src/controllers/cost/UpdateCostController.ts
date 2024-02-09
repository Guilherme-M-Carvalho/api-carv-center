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
            description,
            priceResale
        } = req.body
        
        const dto = new UpdateCostDto()
        const validation = dto.handleValidation({
            id,
            amount,
            name,
            price,
            priceResale
        })
        const service = new UpdateCostService()
        const update = await service.execute({
            id,
            amount,
            name,
            price,
            description,
            priceResale
        })
        return res.send(update)
    }
}