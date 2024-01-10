import { Response, Request } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

export class DetailUserController {
    async handle(req: Request, res: Response) {
        const id = req.params.id
        const detailUserSevice = new DetailUserService()
        const detail = await detailUserSevice.execute({ id: Number(id) })
        return res.json(detail)
    }
}