import { Request, Response } from "express"
import { CreateServiceService } from "../../services/service/CreateServiceService"

export class CreateServiceController {
    async handle(req: Request, res: Response) {


        const { car, serviceDetail } = req.body

        const createServiceService = new CreateServiceService()

        const service = await createServiceService.execute({
            car: JSON.parse(car), 
            serviceDetail: JSON.parse(serviceDetail),
            files: req.files
        })

        return res.send(service)
    }
}