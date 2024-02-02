import prismaClient from "../../prisma";

export class FindTypeServiceService {
    async execute() {
        try {
            return await prismaClient.typeService.findMany({
                where: {
                    deleted: false
                }
            })
        } catch (error) {
            throw new Error("Internal error");
        }
    }
}