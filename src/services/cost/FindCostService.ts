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
                            costProduct: {
                                select: {
                                    id: true,
                                    price: true,
                                    priceResale: true,
                                    service_detail_id: true,
                                    cost_resale_id: true,
                                    created_at: true,
                                    updated_at: true
                                },
                                where: {
                                    deleted: false
                                },
                            },
                        }
                    },
                    name: true,
                    description: true,
                    created_at: true,
                    updated_at: true
                }
            })

            return cost.map(el => {
                const productSold = el.costHitory.reduce((acc, val) => {
                    const append = val.costProduct.filter(item => item.cost_resale_id || item.service_detail_id)
                    return [...acc, ...append]
                }, [])
                const productStock = el.costHitory.reduce((acc, val) => {
                    const append = val.costProduct.filter(item => !item.cost_resale_id && !item.service_detail_id)
                    return [...acc, ...append]
                }, [])
                const priceResale: { price: number; amount: number}[] = []
                const priceResaleStock = productStock.reduce((acc, val) => {
                    const index = acc.findIndex(el=> Number(el.price) == Number(val.priceResale))
                    if(index > -1){
                        acc[index].amount += 1
                        return [...acc]
                    }
                    acc.push({ amount: 1, price: Number(val.priceResale) })
                    return [...acc]
                },priceResale)

                const totalResale = productSold.reduce((acc, val) => acc + Number(val.priceResale), 0)
                const history = el.costHitory.pop()


                const res = {
                    ...el,
                    totalResale: totalResale,
                    totalSold: productSold.length,
                    price: history.price,
                    priceResale: priceResaleStock,
                    amountStock: productStock.length
                }
                delete res.costHitory
                return res
            })
        } catch (error) {
            console.log(error);

            throw new Error("Internal error")
        }
    }
}