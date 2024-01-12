import prismaClient from "../../prisma";

export class FindServiceService {
    async execute(){
        try {
            return await prismaClient.serviceCar.findMany({
                select: {
                    car: {
                        select: {
                            id: true,
                            plate: true,
                            description: true
                        }
                    },
                    price: true,
                    id: true,
                    serviceDetail: {
                        select: {
                            description: true,
                            id: true,
                            price: true,
                            image: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            throw new Error("Internal error");
        }

    }
}