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
        const resale = await new FindFirstResaleService().execute({ id })

        try {
            await prismaClient.costProduct.updateMany({
                data: {
                    cost_resale_id: null
                },
                where: {
                    cost_resale_id: resale.id
                }
            })
        } catch (error) {
            throw new Error("Internal error");

        }

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
                            cost_id: product.id,
                            deleted: false,
                            cost: {
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
        const priceTotal = counts.reduce((acc, val) => acc + val.count.reduce((ac, value) => ac + Number(value.priceResale), 0), 0)

        const ids = counts.reduce((ac, el) => [...ac, ...el.count.reduce((acc, val) => [...acc, val.id], [])], [])
        try {
            await prismaClient.costResale.update({
                data: {
                    price: priceTotal,
                },
                where: {
                    id: resale.id
                }
            })

            await prismaClient.costProduct.updateMany({
                data: {
                    cost_resale_id: resale.id
                },
                where: {
                    id: {
                        in: ids
                    }
                }
            })
            return await new FindFirstResaleService().execute({ id })
        } catch (error) {
            throw new Error("Internal Error");

        }
    }
}