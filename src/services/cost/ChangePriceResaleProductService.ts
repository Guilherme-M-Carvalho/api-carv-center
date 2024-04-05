import prismaClient from "../../prisma";
import { FindFirstCostService } from "./FindFirstCostService";

type CostProps = {
    cost_history_id: number;
    id: number;
    priceResale: number;
    changeAllProducts: boolean
}

export class ChangePriceResaleProductService {
    async execute({ cost_history_id, changeAllProducts, priceResale, id }: CostProps) {

        const find = await new FindFirstCostService().execute(id)

        if (!find) throw new Error('{"message": "Custo inválido"}')


        try {
            if (changeAllProducts) {
                await prismaClient.costProduct.updateMany({
                    data: {
                        priceResale: priceResale
                    },
                    where: {
                        costHistory: {
                            cost_id: id
                        },
                        cost_resale_id: null,
                        service_detail_id: null
                    }
                })
            } else {

                await prismaClient.costProduct.updateMany({
                    data: {
                        priceResale: priceResale,
                    },
                    where: {
                        cost_history_id: cost_history_id,
                        cost_resale_id: null,
                        service_detail_id: null
                    }
                })
            }

        } catch (error) {
            throw new Error("Internal error")
        }
    }
}