import prismaClient from "../../prisma";

type CostProps = {
    id?: number;
    name: string;
    description?: string;
    amount: number;
    price: number;
    priceResale: number;
    deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export class CreateCostService {
    async execute({ amount, deleted, name, price, description, priceResale }: CostProps) {

        const priceUnitary = price / amount

        if(priceUnitary > priceResale)throw new Error('{"field": "priceResale", "message": "Preço de revenda menor que o custo!"}');

        const createProduct =  Array.from(Array(Number(amount)).keys()).map(el => {
            return  {
                price: priceUnitary,
                priceResale: priceResale
            }
        })

        if(createProduct.length != amount) throw new Error('{"field": "amount", "message": "Erro na quantidade!"}');

        try {
            return await prismaClient.cost.create({
                data: {
                    costHitory: {
                        create: {
                            amount: amount,
                            price: price,
                            priceResale: priceResale,
                            costProduct: {
                                create: createProduct
                            }
                        }
                    },
                    name: name,
                    description: description,
                }
            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}