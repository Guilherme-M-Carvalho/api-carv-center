import prismaClient from "../../prisma";
import { FindFirstCostService } from "./FindFirstCostService";

type CostProps = {
    id?: number;
    amount: number;
    price: number;
    priceResale: number;
    changeAllProducts: boolean
}

export class CreateProductService {
    async execute({ amount, changeAllProducts, price, priceResale, id }: CostProps) {

        const find = await new FindFirstCostService().execute(id)

        if (!find) throw new Error('{"message": "Custo inválido"}')


        const priceUnitary = price / amount

        if (priceUnitary > priceResale) throw new Error('{"field": "priceResale", "message": "Preço de revenda menor que o custo!"}');

        const createProduct = Array.from(Array(Number(amount)).keys()).map(el => {
            return {
                price: priceUnitary,
                priceResale: priceResale
            }
        })

        if (createProduct.length != amount) throw new Error('{"field": "amount", "message": "Erro na quantidade!"}');

        if (changeAllProducts) {
            try {
                await prismaClient.costProduct.updateMany({
                    data: {
                        priceResale: priceResale
                    },
                    where: {
                        costHistory: {
                            cost_id: id
                        },
                        cost_resale_id: null,
                        service_detail_id: null
                    }
                })
            } catch (error) {
                throw new Error("Internal error")
            }
        }

        try {
            return await prismaClient.costHistory.create({
                data: {
                    amount: amount,
                    price: price,
                    priceResale: priceResale,
                    costProduct: {
                        create: createProduct,

                    },
                    cost_id: id
                },

            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}