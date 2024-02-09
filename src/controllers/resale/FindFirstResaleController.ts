import { Request, Response } from "express";
import { FindFirstResaleService } from "../../services/resale/FindFirstResaleService";

export class FindFirstResaleController{
    async handle(req: Request, res:Response){
        const id = req.params.id
        const service = new FindFirstResaleService()
        const resale = await service.execute({
            id: Number(id)
        })
        return res.send(resale)
    }
}