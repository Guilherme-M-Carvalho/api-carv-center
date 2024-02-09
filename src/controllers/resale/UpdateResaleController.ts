import { Request, Response } from "express";
import { UpdateResaleDto } from "../../dto/resale/UpdateResaleDto";
import { UpdateResaleService } from "../../services/resale/UpdateResaleService";

export class UpdateResaleController {
    async handle(req: Request, res: Response){
        const { products, id } = req.body
        const dto = new UpdateResaleDto()
        dto.handleValidation({products, id})
        const service = new UpdateResaleService()
        const update = await service.execute({products, id})
        return res.send(update)
    }
}