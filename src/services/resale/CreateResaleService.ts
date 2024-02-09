import { CreateResaleProps, ProductProps } from "../../dto/resale/CreateResaleDto";
import prismaClient from "../../prisma";

type CountsProps = ProductProps & {count: {
    id: number;
    priceResale: any
}[]}


export class CreateResaleService {
    async execute({ products }: CreateResaleProps) {
        let counts: CountsProps[] = []
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
            if(amount > count.length){
                throw new Error(`{"field": "amount", "message": "Quantidade selecionada maior que em estoque", "position": "${index}"}`);
            }
        })
        const priceTotal = counts.reduce((acc, val) => acc + val.count.reduce((ac, value) => ac + Number(value.priceResale), 0), 0)
        const ids = counts.reduce((ac, el) => [...ac, ...el.count.reduce((acc, val) =>  [...acc, val.id], [])], [])
        
        try {
            const resale = await prismaClient.costResale.create({
                data: {
                    price: priceTotal,
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
            return resale
        } catch (error) {
            throw new Error("Internal Error");
            
        }
    }
}