import { Request, Response } from "express";
import { FindByPlateCarService } from "../../services/car/FindByPlateCarService";

export class FindByPlateCarController {
    async handle(req: Request, res: Response){
        const plate = req.params.plate
        const findByPlateCarService = new FindByPlateCarService()
        const car = await findByPlateCarService.execute({plate})
        return res.send(car)
    }
}