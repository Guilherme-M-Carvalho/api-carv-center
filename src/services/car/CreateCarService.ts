import prismaClient from "../../prisma"

export interface CarProps {
    id?: number
    description: string
    plate: string
}

export class CreateCarService {
    async execute({
        description,
        plate
    }: CarProps){
        try {
            return await prismaClient.car.create({
                data: {
                    description: description,
                    plate: plate,
                },
                select: {
                    id: true,
                    description: true,
                    plate: true,
                }
            })
        } catch (error) {
            throw new Error("Internal error");
        }
    }
}