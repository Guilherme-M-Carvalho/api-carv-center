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
                            costHistory: {
                                select: {
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
                type ProductProps = {
                    id: number;
                    cost: {
                        id: number;
                        created_at: Date;
                        updated_at: Date;
                        name: string;
                        description: string;
                    };
                }[] 

                const initReduce: ProductProps = []

                const products: ProductProps = el.costProduct.reduce((acc, item) => acc.find(el => el.cost.id == item.costHistory.cost.id) ? [...acc] : [...acc, 
                    {
                        id: item.id,
                        cost: {
                            ...item.costHistory.cost
                        }
                    }
                ], initReduce)

                return {
                    ...el,
                    amountProduct: el.costProduct.length,
                    amountTypeProduct: products.length,
                    products: products.reduce((acc, val, index) => acc + `${el.costProduct.filter(item => item.costHistory.cost.id === val.cost.id).length} ${val.cost.name}${(index + 1) === products.length ? "" : ", "}`, "")
                }
            })
        } catch (error) {
            throw new Error("Internal Error");
        }
    }
}