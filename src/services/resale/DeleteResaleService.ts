import prismaClient from "../../prisma";
import { FindFirstResaleService } from "./FindFirstResaleService";

export class DeleteResaleService{
    async execute({id}: {id: number}){
        const findFirst = await new FindFirstResaleService().execute({id})
        try {
            return await prismaClient.costResale.update({
                data: {
                    deleted: true
                },
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw new Error("Internal Error");
        }
    }
}