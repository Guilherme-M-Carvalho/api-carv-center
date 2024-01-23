import prismaClient from "../../prisma";


export class FindByPlateCarService {
    async execute({ plate }: { plate: string }) {
        var car = null
        try {
            car = await prismaClient.car.findFirst({
                where: {
                    plate: plate.toUpperCase(),
                    deleted: false
                },
                select: {
                    id: true,
                    plate: true,
                    description: true,
                    image: {
                        select: {
                            id: true,
                            name: true,
                        },
                        where: {
                            deleted: false
                        }
                    }
                }
            })
        } catch (error) {
            throw new Error("Internal error");
        }
        if (!car) {
            throw new Error("Veículo não encontrado!");
        }
        return car
    }
}