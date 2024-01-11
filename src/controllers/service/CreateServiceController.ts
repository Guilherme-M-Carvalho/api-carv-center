import { Request, Response } from "express"
import { CreateServiceService } from "../../services/service/CreateServiceService"

export class CreateServiceController {
    async handle(req: Request, res: Response) {
        const { car, serviceDetail, price } = req.body

        const createServiceService = new CreateServiceService()

        const service = await createServiceService.execute({
            car, 
            serviceDetail, 
            price 
        })

        res.send(service)

    }
}