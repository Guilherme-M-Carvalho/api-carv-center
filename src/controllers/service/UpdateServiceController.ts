import { Request, Response } from "express";
import { UpdateServiceDto } from "../../dto/service/UpdateServiceDto";
import { UpdateServiceService } from "../../services/service/UpdateServiceService";

export class UpdateServiceController {
    async handle(req: Request, res: Response){
        const { car, serviceDetail } = req.body

        const id = Number(req.params.id)
        
        const createServiceService = new UpdateServiceService()
        const dto = new UpdateServiceDto().handleValidation({
            car: JSON.parse(car),
            serviceDetail: JSON.parse(serviceDetail),
            id
        })
        const service = await createServiceService.execute({
            car: JSON.parse(car),
            serviceDetail: JSON.parse(serviceDetail),
            files: {
                service: Array.isArray(req.body?.service) ? req.body?.service : [],
                vehicle: Array.isArray(req.body?.vehicle) ? req.body?.vehicle : []
            },
            id
        })

        return res.send(service)
    }
}