import prismaClient from "../../prisma";

export class FindResaleService {
    async execute() {
        try {
            const resale = await prismaClient.costResale.findMany({
                select: {
                    id: true,
                    price: true,
                    costProduct: {
                        select: {
                            id: true,
                            cost: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    created_at: true,
                                    updated_at: true
                                }
                            }
                        }
                    },
                    created_at: true,
                    updated_at: true
                },
                where: {
                    deleted: false
                }
            })


            return resale.map(el => {

                const products:{
                    id: number;
                    cost: {
                        id: number;
                        created_at: Date;
                        updated_at: Date;
                        name: string;
                        description: string;
                    };
                }[] = el.costProduct.reduce((acc, item) => acc.find(el => el.cost.id == item.cost.id) ? [...acc] : [...acc, item], [])

                return {
                    ...el,
                    amountProduct: el.costProduct.length,
                    amountTypeProduct: products.length,
                    products: products.reduce((acc, val, index) => acc + `${el.costProduct.filter(item => item.cost.id === val.cost.id).length} ${val.cost.name}${(index + 1) === products.length ? "": ", "}`  , "")
                }
            })
        } catch (error) {
            throw new Error("Internal Error");
        }
    }
}