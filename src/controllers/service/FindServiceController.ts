import { Request, Response } from "express";
import { FindServiceService } from "../../services/service/FindServiceService";

export class FindServiceController {
    async handle(req: Request, res: Response){
        const findServiceService = new FindServiceService()
        const services = await findServiceService.execute()
        return res.send(services)
    }
}