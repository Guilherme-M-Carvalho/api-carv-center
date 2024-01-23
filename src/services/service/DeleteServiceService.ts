import prismaClient from "../../prisma"

export class DeleteServiceService {
    async execute(id: number) {
        if (!await this.handleFind(id)) {
            throw new Error('{"error": "Serviço não existe!"}')
        }
        try {
            return  await prismaClient.serviceCar.update({ where: { id: id }, data: { deleted: true } })
        } catch (error) {
            throw new Error("Internal error")
        }
    }

    async handleFind(id: number) {
        try {
            return await prismaClient.serviceCar.findFirst({ where: { id: id } })
        } catch (error) {
            throw new Error("Internal error")
        }
    }
}