import { Request, Response } from "express";
import { FindServiceReportService } from "../../services/service/FindServiceReportService";

export class FindServiceReportController {
    async handle(req: Request, res: Response) {
        console.log("aaa");
        
        const start = req.query?.start
        const end = req.query?.end

        const service = new FindServiceReportService()
        const services = await service.execute({ end: String(end), start: String(start) })
        return res.send(services)
    }
}