import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
    email: string;
    password: string;
}

export class AuthUserService {
    async execute({
        email,
        password
    }: AuthRequest){

        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(!user){
            throw new Error("Usuário não registrado!");
        }
        
        const passwordMatch = await compare(password, user.password)
        
        if(!passwordMatch){
            throw new Error("Senha incorreta!");
        }

        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET ?? "",
            {
                subject: String(user.id),
                expiresIn: '30d'
            }
        )

        delete user.password

        return {
            ...user,
            token
        }
    }
}