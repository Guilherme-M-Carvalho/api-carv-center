import prismaClient from "../../prisma";

export class FindFirstServiceService {
    async execute({ id }: { id: number }) {
        try {
            return await prismaClient.serviceCar.findFirst({
                where: {
                    id: id,
                    deleted: false
                },
                select: {
                    car: {
                        select: {
                            id: true,
                            plate: true,
                            description: true,
                            image: {
                                select: {
                                    id: true,
                                    name: true,
                                    deleted: true
                                },
                                where: {
                                    deleted: false
                                }
                            },

                        },
                        
                    },
                    price: true,
                    id: true,
                    serviceDetail: {
                        select: {
                            description: true,
                            id: true,
                            price: true,
                            deleted: true,
                            image: {
                                select: {
                                    id: true,
                                    name: true,
                                    before: true,
                                    deleted: true
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
                    created_at: true,
                    updated_at: true
                }
            })
        } catch (error) {
            throw new Error("Internal error");
        }

    }
}