import prismaClient from "../../prisma"

export class FindFirstCostService {
    async execute(id: number) {
        try {
            const result = await prismaClient.cost.findFirst({
                where: {
                    id: id,
                    deleted: false
                }
            })
            if (result) {
                return result
            }
        } catch (error) {
            throw new Error("Internal error")
        }
        throw new Error('{"message": "Custo inválido"}')
    }
}