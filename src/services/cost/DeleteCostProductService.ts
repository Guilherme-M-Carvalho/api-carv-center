import prismaClient from "../../prisma"
import { FindFirstCostService } from "./FindFirstCostService"

export class DeleteCostProductService {
    async execute(id: number) {
        const findCostService = new FindFirstCostService()
        if(!id) throw new Error('{"field": "id", "message":"Historico inválido"}');
        
        try {
            return await prismaClient.costProduct.updateMany({
                data: {
                    deleted: true
                },
                where: {
                    service_detail_id: null,
                    cost_resale_id: null,
                    cost_history_id: id
                }
            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}