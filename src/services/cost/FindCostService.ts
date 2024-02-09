import prismaClient from "../../prisma"

export class FindCostService {
    async execute() {
        try {
            const cost = await prismaClient.cost.findMany({
                where: {
                    deleted: false
                },
                select: {
                    id: true,
                    costHitory: {
                        select: {
                            id: true,
                            price: true,
                            priceResale: true,
                            updatePrice: true,
                            created_at: true,
                            updated_at: true,
                        }
                    },
                    name: true,
                    description: true,
                    costProduct: {
                        select: {
                            id: true,
                            price: true,
                            priceResale: true,
                            service_detail_id: true,
                            created_at: true,
                            updated_at: true
                        }
                    },
                    created_at: true,
                    updated_at: true
                }
            })

            return cost.map(el => {
                const totalSold = el.costProduct.filter(item => !!item.service_detail_id)
                const history = el.costHitory.pop()
                const totalResale = totalSold.reduce((acc, val) => acc + Number(val.priceResale), 0)
                const amountStock = el.costProduct.filter(item => !item.service_detail_id)
                const res = {
                    ...el,
                    totalResale: totalResale,
                    totalSold: totalSold.length,
                    amount: el.costProduct.length,
                    price: history.price,
                    priceResale: history.priceResale,
                    amountStock: amountStock.length
                }
                delete res.costHitory
                delete res.costProduct
                return {
                    ...res
                }
            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}