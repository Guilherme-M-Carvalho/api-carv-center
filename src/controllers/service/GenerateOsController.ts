import { Request, Response } from "express";
import { GenerateOsService } from "../../services/service/GenerateOsService";

export class GenerateOsController {
    async handle(req: Request, res: Response) {
        const id = req.params.id
        const service = new GenerateOsService()
        const pdf = await service.execute({ id: Number(id) })
        return res.send({ pdf })
    }
}