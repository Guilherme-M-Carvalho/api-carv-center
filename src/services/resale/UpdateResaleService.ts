import { UpdateResaleProps, ProductProps } from "../../dto/resale/UpdateResaleDto";
import prismaClient from "../../prisma";
import { FindFirstResaleService } from "./FindFirstResaleService";

type CountsProps = ProductProps & {
    count: {
        id: number;
        priceResale: any
    }[]
}


export class UpdateResaleService {
    async execute({ products, id }: UpdateResaleProps) {
        let counts: CountsProps[] = []
        products.map(el => {
            el.amount = el.amount - el.amountSave
        })
        try {
            counts = await Promise.all(products.map(async (product) => {
                return {
                    count: await prismaClient.costProduct.findMany({
                        select: {
                            id: true,
                            priceResale: true
                        },
                        where: {
                            cost_resale_id: null,
                            service_detail_id: null,
                            cost_history_id: product.id,
                            priceResale: product.priceResale,
                            deleted: false,
                            costHistory: {
                                cost: {
                                    deleted: false
                                },
                                deleted: false
                            }
                        },
                        take: product.amount

                    }),
                    ...product
                }
            }))
        } catch (error) {
            throw new Error("Internal Error");

        }


        counts.forEach(({ amount, count, id }, index) => {
            if (amount > count.length) {
                throw new Error(`{"field": "amount", "message": "Quantidade selecionada maior que em estoque", "position": "${index}"}`);
            }
        })
        const priceTotal = counts.reduce((acc, val) => acc + ((val.amount < 0 ? val.amountSave - Math.abs(val.amount) : val.amountSave + val.amount) * val.priceResale), 0)
        const ids = counts.filter(el => el.amount > 0).reduce((ac, el) => [...ac, ...el.count.reduce((acc, val) => [...acc, val.id], [])], [])
        const amountDelete = counts.filter(el => el.amount < 0).reduce((ac, el) => [...ac, { amount: Math.abs(el.amount), historyId: el.id }], [])
        const idsDelete = await Promise.all(amountDelete.map(async ({ historyId, amount }) => {
            console.log({historyId, amount});
            
            return await prismaClient.costProduct.findMany({
                select: {
                    id: true,
                },
                where: {
                    cost_resale_id: id,
                    cost_history_id: historyId
                },
                take: Math.abs(amount)
            })
        }
        ))
        // return { ids, priceTotal, counts, amountDelete, idsDelete }
        try {
            const resale = await prismaClient.costResale.update({
                data: {
                    price: priceTotal,

                },
                where: {
                    id: id
                }
            })

            if (ids.length) {
                await prismaClient.costProduct.updateMany({
                    data: {
                        cost_resale_id: id
                    },
                    where: {
                        id: {
                            in: ids
                        }
                    }
                })
            }
            if (amountDelete.length) {

                await prismaClient.costProduct.updateMany({
                    data: {
                        cost_resale_id: null
                    },
                    where: {
                        id: {
                            in: idsDelete.reduce((acc, val) => [...acc, ...val.reduce((ac, el) => [...ac, el.id],[])], [])
                        },

                    },
                })
            }
            return resale
        } catch (error) {
            throw new Error("Internal Error");

        }
    }
}