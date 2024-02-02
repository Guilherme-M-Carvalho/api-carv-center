import { Request, Response } from "express";
import { CreateCostService } from "../../services/cost/CreateCostService";
import { CreateCostDto } from "../../dto/cost/CreateCostDto";

export class CreateCostController{
    async handle(req: Request, res: Response){
        const {
            amount,
            name,
            price,
            description
        } = req.body
        const dto = new CreateCostDto()
        const validation = dto.handleValidation({
            amount,
            name,
            price,
        })
        const service = new CreateCostService()
        const create = await service.execute({
            amount,
            name,
            price,
            description
        })
        return res.send(create)
    }
}