import { Request, Response } from "express";
import { FindFirstServiceService } from "../../services/service/FindFirstServiceService";

export class FindFirstServiceController {
    async handle(req: Request, res: Response){
        const id = req.params.id
        const findServiceService = new FindFirstServiceService()
        const service = await findServiceService.execute({
            id: Number(id)
        })
        return res.send(service)
    }
}