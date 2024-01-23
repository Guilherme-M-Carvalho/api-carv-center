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
                            description: true,
                            image: {
                                select: {
                                    name: true
                                },
                                where: {
                                    deleted: false
                                }
                            }
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
                                },
                                where: {
                                    deleted: false
                                }
                            }
                        },
                        where: {
                            deleted: false
                        }
                    },
                    updated_at: true,
                    created_at: true
                },
                where: {
                    deleted: false
                }
            })
        } catch (error) {
            throw new Error("Internal error");
        }

    }
}