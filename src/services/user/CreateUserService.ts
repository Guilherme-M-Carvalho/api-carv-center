import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
    name: string;
    email: string;
    password: string;
}

export class CreateUserService {
    async execute({
        email,
        name,
        password
    }: UserRequest){

        if(!email) {
            throw new Error("Email inválido");
        }

        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(userAlreadyExists){
            throw new Error("Usuário já cadastrado");
        }

        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data: {
                email: email,
                name: name,
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return user

    }
}