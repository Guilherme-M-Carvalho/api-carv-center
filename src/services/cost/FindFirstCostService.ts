import prismaClient from "../../prisma"

export class FindFirstCostService {
    async execute(id: number) {
        try {
            const result = await prismaClient.cost.findFirst({
                where: {
                    id: id,
                    deleted: false
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    costHitory: {
                        select: {
                            id: true,
                            price: true,
                            priceResale: true,
                            amount: true,
                            updatePrice: true,
                            created_at: true,
                            updated_at: true,
                        },
                        where: {
                            deleted: false
                        }
                    },
                    costProduct: {
                        select: {
                            id: true,
                            price: true,
                            priceResale: true,
                            created_at: true,
                            updated_at: true,
                            service_detail_id: true,
                            cost_resale_id: true
                        },
                        where: {
                            deleted: false
                        }
                    }
                }
            })
            if (result) {
                const totalSold = result.costProduct.filter(el => !!el.service_detail_id)
                const cost = result.costHitory[result.costHitory.length - 1]
                const totalResale = totalSold.reduce((acc, val) => acc + Number(val.priceResale), 0)
                const response = {
                    ...result,
                    totalSold: totalSold.length,
                    amount: result.costProduct.length,
                    price: cost.price,
                    priceResale: cost.priceResale,
                    totalResale: totalResale
                }
                return response
            }
        } catch (error) {
            throw new Error("Internal error")
        }
        throw new Error('{"message": "Custo inválido"}')
    }
}