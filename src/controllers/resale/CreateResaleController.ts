import { Request, Response } from "express";
import { CreateResaleDto } from "../../dto/resale/CreateResaleDto";
import { CreateResaleService } from "../../services/resale/CreateResaleService";

export class CreateResaleController {
    async handle(req: Request, res: Response){
        const { products } = req.body
        const dto = new CreateResaleDto()
        dto.handleValidation({products})
        const service = new CreateResaleService()
        const create = await service.execute({products})
        return res.send(create)
    }
}