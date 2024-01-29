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
                            client: {
                                select: {
                                    id: true,
                                    name: true,
                                    phone: true,
                                }
                            }

                        },
                        
                    },
                    price: true,
                    id: true,
                    serviceDetail: {
                        select: {
                            created_at: true,
                            updated_at: true,
                            description: true,
                            id: true,
                            price: true,
                            deleted: true,
                            customerParts: true,
                            obs: true,
                            type_service_id: true,
                            typeService: {
                                select: {
                                    id: true,
                                    description: true,
                                }
                            },
                            parts: {
                                select: {
                                    id: true,
                                    price: true,
                                    description: true,
                                },
                                where: {
                                    deleted: false
                                }
                            },
                            image: {
                                select: {
                                    id: true,
                                    name: true,
                                    before: true,
                                    deleted: true,
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