import prismaClient from "../../prisma";

type CostProps = {
    id?: number;
    name: string;
    description?: string;
    amount: number;
    price: number;
    deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export class CreateCostService {
    async execute({ amount, deleted, name, price, description }: CostProps) {
        try {
            return await prismaClient.cost.create({
                data: {
                    amount: amount,
                    name: name,
                    price: price,
                    description: description
                }
            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}