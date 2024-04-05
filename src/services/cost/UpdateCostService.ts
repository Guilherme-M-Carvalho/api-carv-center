import prismaClient from "../../prisma";
import { FindFirstCostService } from "./FindFirstCostService";

type CostProps = {
    id?: number;
    name: string;
    description?: string;
}

export class UpdateCostService {
    async execute({ name, description, id }: CostProps) {

        const findFirst = await new FindFirstCostService().execute(id)

        const data: any = {
            name: name,
            description: description,
        }

        try {
            const update = await prismaClient.cost.update({
                data: data,
                where: {
                    id: id
                }
            })
            return update
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}