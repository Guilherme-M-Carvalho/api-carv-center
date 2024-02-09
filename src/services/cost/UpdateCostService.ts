import prismaClient from "../../prisma";
import { FindFirstCostService } from "./FindFirstCostService";

type CostProps = {
    id?: number;
    name: string;
    description?: string;
    amount: number;
    price: number;
    deleted?: boolean;
    priceResale: number;
    created_at?: Date;
    updated_at?: Date;
}

export class UpdateCostService {
    async execute({ amount, deleted, name, price, description, priceResale, id }: CostProps) {

        const findFirst = await new FindFirstCostService().execute(id)
        const history = findFirst.costHitory[findFirst.costHitory.length - 1]
        const amountOldArr = findFirst.costProduct.filter(el => !el.service_detail_id && !el.cost_resale_id)
        const amountOld = amountOldArr.length

        const priceUnitary = Number(price) / Number(amount)

        if (priceUnitary > priceResale) {
            throw new Error('{"field": "priceResale", "message": "Preço de revenda menor que o custo!"}');
        }

        if (Number(history.price) === Number(price) && Number(history.priceResale) === Number(priceResale) && Number(amount) === Number(history.amount)) {
            return findFirst
        }

        const data: any = {
            costHitory: {
                create: {
                    amount: amount,
                    price: price,
                    priceResale: priceResale,
                    updatePrice: true
                }
            },
            name: name,
            description: description,
            costProduct: {
                updateMany: {
                    data: {
                        price: priceUnitary,
                        priceResale: priceResale
                    },
                    where: {
                        cost_id: id,
                        service_detail_id: null
                    }
                }
            }
        }

        let updateDelete = null

        if (amount > amountOld) {
            const createProduct = Array.from(Array(amount - amountOld).keys()).map(el => {
                return {
                    price: priceUnitary,
                    priceResale: priceResale
                }
            })
            data.costProduct.create = createProduct
        } else if (amount < amountOld) {
            const deleteProduct = amountOld - amount
            const ids = []
            amountOldArr.forEach((el, index) => {
                if (index < deleteProduct) {
                    ids.push(el.id)
                }
            })
            updateDelete = {
                data: {
                    costProduct: {
                        updateMany: {
                            data: {
                                deleted: true
                            },
                            where: {
                                id: {
                                    in: ids
                                }
                            }
                        }
                    }
                },
                where: {
                    id: id
                }
            }
            data.costProduct.updateMany.where.id = {
                notIn: ids
            }
        }

        try {
            const update = await prismaClient.cost.update({
                data: data,
                where: {
                    id: id
                }
            })

            if (updateDelete) {
                await prismaClient.cost.update(updateDelete)
            }

            return update
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}