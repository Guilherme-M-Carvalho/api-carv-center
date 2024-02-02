import prismaClient from "../../prisma"

export class FindCostService {
    async execute() {
        try {
            return await prismaClient.cost.findMany({
                where: {
                    deleted: false
                }
            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}