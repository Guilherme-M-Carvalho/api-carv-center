import prismaClient from "../../prisma"

export class FindCostResaleService {
    async execute() {
        try {
            const cost = await prismaClient.costProduct.groupBy({
                by: ["cost_history_id", "priceResale"],
                _count: {
                    id: true
                },
                where: {
                    costHistory: {
                       deleted: false 
                    },
                    deleted: false,
                    cost_resale_id: null,
                    service_detail_id: null
                }
            })


            const history = await prismaClient.costHistory.findMany({
                select: {
                    id: true,
                    amount: true,
                    price: true,
                    cost: {
                        select: {
                            id: true,
                            created_at: true,
                            name: true,
                            description: true,
                            updated_at: true,

                        }
                    },
                    costProduct: {
                        select: {
                            id: true,
                            priceResale: true
                        }
                    }

                },
                where: {
                    deleted: false,
                    cost: {
                        deleted: false
                    }
                }
            })

            // return {cost, history}



            return history.map(item => {
                const costFind = cost.find(el => el.cost_history_id == item.id)

                const costReturn = {
                    amountStock: costFind?._count.id ? costFind._count.id : 0,
                    ...item.cost,
                    ...costFind,
                    id: item.id,
                    cost_history_id: item.id,
                    priceResale: costFind?.priceResale ? costFind?.priceResale : item.costProduct[0]?.priceResale
                }

                // delete costReturn.costProduct

                return costReturn
            })
            return cost.map(el => {
                const historyFind = history.find(item => el.cost_history_id == item.id)
                const cost = {
                    ...el,
                    ...historyFind?.cost,
                    amountStock: el._count.id
                }
                delete cost._count
                return cost
            })

            // return cost.map(el => {
            //     const productSold = el.costHitory.reduce((acc, val) => {
            //         const append = val.costProduct.filter(item => item.cost_resale_id || item.service_detail_id)
            //         return [...acc, ...append]
            //     }, [])
            //     const productStock = el.costHitory.reduce((acc, val) => {
            //         const append = val.costProduct.filter(item => !item.cost_resale_id && !item.service_detail_id)
            //         return [...acc, ...append]
            //     }, [])
            //     const priceResale: { price: number; amount: number}[] = []
            //     const priceResaleStock = productStock.reduce((acc, val) => {
            //         const index = acc.findIndex(el=> Number(el.price) == Number(val.priceResale))
            //         if(index > -1){
            //             acc[index].amount += 1
            //             return [...acc]
            //         }
            //         acc.push({ amount: 1, price: Number(val.priceResale) })
            //         return [...acc]
            //     },priceResale)

            //     const totalResale = productSold.reduce((acc, val) => acc + Number(val.priceResale), 0)
            //     const history = el.costHitory.pop()


            //     const res = {
            //         ...el,
            //         totalResale: totalResale,
            //         totalSold: productSold.length,
            //         price: history.price,
            //         priceResale: priceResaleStock,
            //         amountStock: productStock.length
            //     }
            //     delete res.costHitory
            //     return res
            // })
        } catch (error) {
            console.log(error);

            throw new Error("Internal error")
        }
    }
}