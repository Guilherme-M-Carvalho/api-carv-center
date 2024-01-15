import prismaClient from "../../prisma";

export class FindFirstServiceService {
    async execute({ id }: { id: number }) {
        try {
            return await prismaClient.serviceCar.findFirst({
                where: {
                    id: id
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
                                    name: true
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
                                    before: true
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