import { Request, Response } from "express";
import { DeleteServiceService } from "../../services/service/DeleteServiceService";

export class DeleteServiceController {
    async handle(req: Request, res: Response){
        const service = new DeleteServiceService()
        const deleteService = await service.execute(Number(req.params.id))
        res.send({message: "Serviço deletado com sucesso!"})
    }
}