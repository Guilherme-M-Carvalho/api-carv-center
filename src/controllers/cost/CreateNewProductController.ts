import { Request, Response } from "express"
import { CreateProductService } from "../../services/cost/CreateProductService"
import { CreateProductDto } from "../../dto/cost/CreateProductDto"

export class CreateNewProductController{
    async handle(req: Request, res: Response){
        const { id, amount, changeAllProducts, price, priceResale } = req.body
        const dto = new CreateProductDto()
        dto.handleValidation({ changeAllProducts,amount, id, price, priceResale })
        const service = new CreateProductService()
        const create = await service.execute({ changeAllProducts,amount, id, price, priceResale })
        return res.send(create)
    }
}