import prismaClient from "../../prisma"

export interface ServiceDetailProps {
    id?: number
    price: string
    description: string
    image?: Image[]
    service_id: number
}

export interface Image {
    id?: number
    name: string
    service_detail_id: number
}

export class CreateServiceDetailService {
    async execute({
        price,
        description,
        service_id,
        image
    }: ServiceDetailProps){
        try {
            const serviceDetail = await prismaClient.serviceDetailCar.create({
                data: {
                    description: description,
                    price: price,
                    service_id: service_id,
                }
            })
        } catch (error) {
            throw new Error("Internal error");
                        
        }

    }
}