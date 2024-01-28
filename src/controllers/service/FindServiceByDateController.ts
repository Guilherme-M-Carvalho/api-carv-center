import { Request, Response } from "express";
import { FindServiceByDateService } from "../../services/service/FindServiceByDateService";

export class FindServiceByDateController{
    async handle(req: Request, res: Response){
        const date = req.params.date
        const service = new FindServiceByDateService()
        const services = await service.execute(date)
        return res.send(services)
    }
}