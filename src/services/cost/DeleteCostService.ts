import prismaClient from "../../prisma"
import { FindFirstCostService } from "./FindFirstCostService"

export class DeleteCostService {
    async execute(id: number) {
        const findCostService = new FindFirstCostService()
        await findCostService.execute(id)
        try {
            return await prismaClient.cost.update({
                data: {
                    deleted: true
                },
                where: {
                    id: id,
                }
            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}