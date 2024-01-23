import { Request, Response } from "express";
import { FindServiceService } from "../../services/service/FindServiceService";
import { FindServiceDto } from "../../dto/service/FindServiceDto";

export class FindServiceController {
    async handle(req: Request, res: Response){
        const findServiceService = new FindServiceService()
        const findServiceDto = new FindServiceDto()
        const services = await findServiceService.execute()
        return res.send(findServiceDto.handleFindDto(services))
    }
}