import prismaClient from "../../prisma"

interface DetailProps {
    id: number
}

export class DetailUserService {
    async execute({
        id
    }: DetailProps){
        const user = await prismaClient.user.findFirst({
            where: {
                id: id
            },
        })

        if(!user){
            throw new Error("Usuário não existe!");
        }

        delete user.password

        return user
    }
}