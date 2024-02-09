import { Request, Response } from "express";
import { DeleteResaleService } from "../../services/resale/DeleteResaleService";

export class DeleteResaleController{
    async handle(req: Request, res: Response){
        const id = req.params.id
        const service = new DeleteResaleService()
        const deleteResale = await service.execute({id: Number(id)})
        return res.send(deleteResale)
    }
}