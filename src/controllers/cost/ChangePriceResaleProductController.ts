import { Request, Response } from "express"
import { CreateProductService } from "../../services/cost/CreateProductService"
import { CreateProductDto } from "../../dto/cost/CreateProductDto"
import { ChangePriceResaleProductDto } from "../../dto/cost/ChangePriceResaleProductDto"
import { ChangePriceResaleProductService } from "../../services/cost/ChangePriceResaleProductService"

export class ChangePriceResaleProductController{
    async handle(req: Request, res: Response){
        const { id, cost_history_id, changeAllProducts, priceResale } = req.body
        const dto = new ChangePriceResaleProductDto()
        dto.handleValidation({ changeAllProducts, cost_history_id, id, priceResale })
        const service = new ChangePriceResaleProductService()
        const create = await service.execute({ changeAllProducts, cost_history_id, id, priceResale })
        return res.send()
    }
}