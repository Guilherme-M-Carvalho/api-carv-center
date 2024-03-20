import prismaClient from "../../prisma";

export class FindFirstServiceService {
    async execute({ id }: { id: number }) {
        try {
            const service = await prismaClient.serviceCar.findFirst({
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
                            },
                            costProduct: {
                                select: {
                                    cost: {
                                        select: {
                                            name: true,
                                            id: true,
                                        }
                                    },
                                    price: true,
                                    priceResale: true,
                                    id: true
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
            service.serviceDetail.map((el: any) => {
                const product: {id: number; amount: number}[] = []
                el.costProduct.map(item => {
                    const indexFind = product.findIndex(el => el.id == item.cost.id)
                    console.log(indexFind);
                    
                    if(Number(indexFind) > -1){
                        product[Number(indexFind)].amount++
                    } else {
                        product.push({id: item.cost.id, amount: 1})
                    }
                })
                el.costProduct = product
            })
            return service
        } catch (error) {
            console.log(error);
            
            throw new Error("Internal error");
        }

    }
}