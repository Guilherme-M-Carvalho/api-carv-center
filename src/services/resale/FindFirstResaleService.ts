import prismaClient from "../../prisma";

export class FindFirstResaleService {
    async execute({ id }: { id: number }) {
        let resale = null
        try {
            resale = await prismaClient.costResale.findFirst({
                select: {
                    id: true,
                    costProduct: {
                        select: {
                            id: true,
                            costHistory: {
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
                                    }
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
        if (!resale) {
            throw new Error(`{"message": "Venda não existe"}`);
        }
        type ProductProps = {
            id: number;
            cost: {
                id: number;
                created_at: Date;
                updated_at: Date;
                name: string;
                description: string;
            };
            priceResale: number
        }[]

        const initReduce: ProductProps = []

        // const products: ProductProps = resale.costProduct.reduce((acc, item) => acc.find(el => el.cost.id == item.costHistory.cost.id && Number(el.ori)) ? [...acc] : [...acc,
        // {
        //     id: item.id,
        //     cost: {
        //         ...item.costHistory.cost
        //     },
        //     priceResale: Number(item.priceResale)
        // }
        // ], initReduce)

        type Product = {
            id: number;
            amount: number;
            priceResale: number
        }[]

        // return resale.costProduct
        const productsAmount = resale.costProduct.reduce((acc, val) => {

            console.log(val.cost);
            
            const index = acc.findIndex(el => el.id == val.costHistory.id && Number(el.priceResale) == Number(val.priceResale))
            if (index > -1) {
                acc[index].amount += 1
                return [...acc]
            }
            return [...acc, {
                id: val.costHistory.id,
                amount: 1,
                priceResale: val.priceResale
            }]
        }, <Product>[])

        return {
            ...resale,
            // products2: products,
            products: productsAmount
        }
    }
}