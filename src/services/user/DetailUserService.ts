import prismaClient from "../../prisma"

interface DetailProps {
    id: number
}

export class DetailUserService {
    async execute({
        id
    }: DetailProps){
        const user = await prismaClient.serviceCar.findFirst({
            where: {
                id: id
            },
            select: {
                car: true,
                serviceDetail: {
                    select: {
                        id: true,
                        price: true,
                        description: true,
                        image: true
                    }
                },
                price: true,
                id: true
            }
        })

        if(!user){
            throw new Error("Usuário não existe!");
        }

        // delete user.password

        return user
    }
}