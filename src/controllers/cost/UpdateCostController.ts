import { Request, Response } from "express";
import { UpdateCostService } from "../../services/cost/UpdateCostService";
import { UpdateCostDto } from "../../dto/cost/UpdateCostDto";

export class UpdateCostController {
    async handle(req: Request, res: Response) {
        const {
            id,
            name,
            description,
        } = req.body
        
        const dto = new UpdateCostDto()
        const validation = dto.handleValidation({
            id,
            name,
        })
        const service = new UpdateCostService()
        const update = await service.execute({
            id,
            name,
            description,
        })
        return res.send(update)
    }
}