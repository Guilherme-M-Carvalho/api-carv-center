import prismaClient from "../../prisma";
import { FindFirstCostService } from "./FindFirstCostService";

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

export class UpdateCostService {
    async execute({ id, amount, name, price, description }: CostProps) {
        const findCostService = new FindFirstCostService()
        await findCostService.execute(Number(id))

        try {
            return await prismaClient.cost.update({
                data: {
                    amount: amount,
                    name: name,
                    price: price,
                    description: description
                },
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}