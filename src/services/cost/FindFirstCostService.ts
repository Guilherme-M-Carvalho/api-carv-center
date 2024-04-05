import { response } from "express"
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
                                },
                            },

                        },
                        where: {
                            deleted: false
                        },
                        orderBy: {
                            id: "desc"
                        }
                    }
                },
            })

            if (result) {
                const  costHitory = result.costHitory.map(el => {
                    const priceResale: { price: number; amount: number}[] = []
                    const amountStock = el.costProduct.filter(el => !el.cost_resale_id && !el.service_detail_id)
                    const amountSold = el.costProduct.filter(el => !!el.cost_resale_id || el.service_detail_id)
                    const field = {
                        ...el,
                        amountSold: amountSold.length,
                        totalSold: amountSold.reduce((acc, val) => acc + Number(val.priceResale), 0),
                        amountStock: amountStock.length,
                        amountDelete: Number(el.amount) - (amountStock.length + amountSold.length),
                        priceResale: amountStock.reduce((acc, val) => {
                            const index = acc.findIndex(el=> Number(el.price) == Number(val.priceResale))
                            if(index > -1){
                                acc[index].amount += 1
                                return [...acc]
                            }
                            acc.push({ amount: 1, price: Number(val.priceResale) })
                            return [...acc]
                        },priceResale)
                    }

                    delete field.costProduct
                    return field
                })

                const res = {
                    ...result,
                    costHitory: costHitory,
                    priceResale: result.costHitory.find(el => el.costProduct.length).costProduct[0].priceResale,
                    amountSold: costHitory.reduce((acc, val) => acc + Number(val.amountSold),0),
                    totalSold: costHitory.reduce((acc, val) => acc + Number(val.totalSold),0)
                }



                return res
            }
        } catch (error) {
            console.log(error);
            
            throw new Error("Internal error")
        }
        throw new Error('{"message": "Custo inválido"}')
    }
}