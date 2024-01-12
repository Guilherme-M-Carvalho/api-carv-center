import prismaClient from "../../prisma"

export interface ImageProps {
    id?: number
    name: string
    service_detail_id: number
}

export class CreateImageService {
    async execute({
        name,
        service_detail_id
    }: ImageProps){
        try {
            await prismaClient.image.create({
                data: {
                    name: name,
                    service_detail_id: service_detail_id
                }
            })
        } catch (error) {
            throw new Error("");
            
        }
    }
}