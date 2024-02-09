import prismaClient from "../../prisma";

export class FindFirstResaleService {
    async execute({id}: {id: number}){
        let resale = null
        try {
            resale = await prismaClient.costResale.findFirst({
                select: {
                    id: true,
                    costProduct: {
                        select: {
                            id: true,
                            cost: {
                                select: {
                                    id: true,
                                    description: true,
                                    name: true,
                                    created_at: true,
                                    updated_at: true
                                }
                            },
                            priceResale: true,
                            created_at: true,
                            updated_at: true
                        }
                    },
                    price: true,
                    created_at: true,
                    updated_at: true
                },
                where: {
                    id: id,
                    deleted: false
                }
            })
        } catch (error) {   
            throw new Error("Internal error");   
        }
        if(!resale){
            throw new Error(`{"message": "Venda não existe"}`);
        }
        const products:{
            id: number;
            cost: {
                id: number;
                created_at: Date;
                updated_at: Date;
                name: string;
                description: string;
            };
        }[] = resale.costProduct.reduce((acc, item) => acc.find(el => el.cost.id == item.cost.id) ? [...acc] : [...acc, item], [])

        const productsAmount = products.map(prod => {
            return {
                id: prod.cost.id,
                amount: resale.costProduct.filter(item => item.cost.id ==prod.cost.id).length
            }
        })


        return {
            ...resale,
            products: productsAmount
        }
    }
}