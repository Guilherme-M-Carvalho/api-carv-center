import { Request, Response } from "express"
import { CreateServiceService } from "../../services/service/CreateServiceService"
import { CreateServiceDto } from "../../dto/service/CreateServiceDto"

export class CreateServiceController {
    async handle(req: Request, res: Response) {

        const { car, serviceDetail } = req.body

        const createServiceService = new CreateServiceService()
        const dto = new CreateServiceDto().handleValidationCreateService({
            car: JSON.parse(car),
            serviceDetail: JSON.parse(serviceDetail)
        })
        const service = await createServiceService.execute({
            car: JSON.parse(car),
            serviceDetail: JSON.parse(serviceDetail),
            files: {
                service: Array.isArray(req.body?.service) ? req.body?.service : [],
                vehicle: Array.isArray(req.body?.vehicle) ? req.body?.vehicle : []
            }
        })

        return res.send(service)
    }
}